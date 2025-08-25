import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';

function Car({ carRef }: CarProps) {
  const rapier = useRapier(); // ✅ 추가: 레이캐스트 쓰려면 rapier world 접근 필요
  const prevSpacePressed = useRef(false);
  // const { camera } = useThree(); // 카메라 객체
  const [onGround, setOnGround] = useState(false);
  const [jumpCooldown, setJumpCooldown] = useState(0);

  // 키 상태 셀렉터: 렌더마다 최신 키 입력을 Hooks로 구독
  const forward = useKeyboardControls((s) => s.forward);
  const backward = useKeyboardControls((s) => s.backward);
  const left = useKeyboardControls((s) => s.left);
  const right = useKeyboardControls((s) => s.right);
  const jump = useKeyboardControls((s) => s.jump);

  // 물리/조작 파라미터 (필요 시 조절)
  const MAX_SPEED = 14; // 최대 목표 속도 (m/s 가정, 전/후진 동일)
  const ACCEL = 28; // 가속도 등가 임펄스 크기(질량 보정 전)
  const STEER = 10; // 조향 토크(요 회전 강도)
  const LIN_DAMP = 0.6; // 선형 감쇠 (미끄럼 줄이기)
  const ANG_DAMP = 2.0; // 각 감쇠 (회전 잔진동 줄이기)
  const DT_CAP = 1 / 30; // 저프레임 스파이크 캡(물리 안정화)
  const JUMP_COOLDOWN = 0.2; // 연속 점프 불가하게 쿨다운 시간 설정
  const JUMP = 10; // 점프 세기

  useFrame((_, dtRaw) => {
    const body = carRef.current;
    if (!body) return;

    const dt = Math.min(dtRaw, DT_CAP); // dt 캡: 급격한 프레임 지연에도 물리 안정성 유지

    // 쿨다운 타이머 감소
    if (jumpCooldown > 0) {
      setJumpCooldown((t) => Math.max(0, t - dt));
    }

    // 현재 차체 회전(Quaternion) → "전방 벡터" 계산 (Z-)
    const { x, y, z, w } = body.rotation(); // 물체의 방향 정보 추출
    const q = new THREE.Quaternion(x, y, z, w); // 물체의 회전 정보 추출
    // Vector3(0, 0, -1): 물체를 기본 앞방향 설정 (-z방향 === 사용자로부터 멀어지는 방향)
    // applyQuaternion(q): 물체의 회전 정보를 통해 실제 앞방향 추출
    // normalize(): 물제의 앞방향 값을 1로 정규화
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(q).normalize();

    // 입력 해석: 전/후진은 +1/-1, 무입력은 0
    const driveInput = (forward ? 1 : 0) - (backward ? 1 : 0); // forward=+1, backward=-1
    // 좌/우 조향 입력: 좌=+1, 우=-1
    const steerInput = (left ? 1 : 0) - (right ? 1 : 0);

    // 현재 속도의 전방향 성분(스칼라): 전진 중(+) / 후진 중(-)
    const v = body.linvel(); // 물체의 각 방향의 속도 정보 추출
    const speedAlongForward = v.x * fwd.x + v.z * fwd.z; // 물체의 앞/뒤 방향 속도

    // 목표 속도: 전/후진 입력이 있으면 그 방향으로, 없으면 0(서서히 감속)
    //    - 이 방식은 "목표 속도 추종"이라 과도한 가속/감속 없이 자연스럽게 움직임
    const targetSpeed = driveInput * MAX_SPEED;

    // 현재 전방 속도에서 목표 속도까지 필요한 변화량을 한 프레임 임펄스로 제한
    //    - clamp로 가속도를 DT에 비례해 제한 → 프레임 독립적 조작감
    const neededDelta = THREE.MathUtils.clamp(
      targetSpeed - speedAlongForward,
      -ACCEL * dt,
      ACCEL * dt,
    );

    // 질량 보정 임펄스 적용: Rapier는 질량에 따라 반응하므로 m을 곱해 동일 체감 가속 제공
    if (neededDelta !== 0) {
      const m = body.mass();
      body.applyImpulse(
        { x: fwd.x * neededDelta * m, y: 0, z: fwd.z * neededDelta * m },
        true,
      );
      body.wakeUp();
    }

    // 조향 반전 로직 (가장 중요!)
    //  - 직관적인 운전감을 위해 "후진 시" 좌/우 입력을 반대로 적용한다.
    //  - 기준 우선순위:
    //      1) 사용자의 즉시 입력(driveInput)이 있으면 그 방향을 우선 (후진 키를 누르면 즉시 반전)
    //      2) 무입력(coast)일 때는 실제 이동 방향(speedAlongForward)의 부호로 판단
    //      3) 완전 정지 상태(=0)라면 전진 기준(=+1)로 처리
    const dirSignFromInput = driveInput === 0 ? 0 : Math.sign(driveInput); // +1 | -1 | 0
    const dirSignFromSpeed =
      speedAlongForward === 0 ? 1 : Math.sign(speedAlongForward); // +1 | -1
    const steerDirectionSign =
      dirSignFromInput !== 0 ? dirSignFromInput : dirSignFromSpeed;
    //  결과: 전진(+1) → 그대로, 후진(-1) → 좌우 반전

    // 조향 토크(요 회전): 속도가 높을수록 조금 더 잘 돌게 가중치 부여
    if (steerInput !== 0) {
      const speedFactor =
        1 + Math.min(Math.abs(speedAlongForward) / MAX_SPEED, 1);
      const yaw = steerInput * steerDirectionSign * STEER * dt * speedFactor;
      body.applyTorqueImpulse({ x: 0, y: yaw, z: 0 }, true);
    }

    const pos = body.translation();
    const ray = rapier.world.castRay(
      new RAPIER.Ray({ x: pos.x, y: pos.y, z: pos.z }, { x: 0, y: -1, z: 0 }),
      1.1, // 레이 길이: 차 높이보다 약간 긴 값
      true,
    );
    setOnGround(ray !== null);

    // 점프 (스페이스바)
    if (
      jump &&
      !prevSpacePressed.current &&
      onGround &&
      v.y < 0.1 &&
      jumpCooldown <= 0
    ) {
      body.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
      setJumpCooldown(JUMP_COOLDOWN); // 점프 후 쿨다운 시작
      body.wakeUp();
    }

    // 직전 프레임 키 상태 갱신
    prevSpacePressed.current = jump;
    // 감쇠: 마찰/공기저항 느낌. 값이 높을수록 급격히 감속/감회전
    body.setLinearDamping(LIN_DAMP);
    body.setAngularDamping(ANG_DAMP);

    // 자동차 카메라 따라가기
    // camera.position.lerp(new THREE.Vector3(pos.x, pos.y + 3, pos.z + 6), 0.1);
    // camera.lookAt(pos.x, pos.y, pos.z);
  });

  return (
    <RigidBody
      ref={carRef}
      // 시작 높이를 약간 띄워 초기 충돌 겹침 방지
      position={[0, 1.5, 0]}
      // 롤/피치 회전 비활성화(전복 방지), 요(좌/우 회전)만 허용
      enabledRotations={[false, true, false]}
      // 충돌체는 수동 지정(colliders={false} + CuboidCollider)로 메쉬와 정확히 일치
      colliders={false}
      // 질량/마찰/탄성(튀김) 튜닝
      mass={1.2}
      friction={1}
      restitution={0}
    >
      {/* 차체 메쉬 (시각용) */}
      <mesh>
        <boxGeometry args={[1.6, 0.6, 3.0]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* 차체와 동일 크기의 큐보이드 콜라이더(충돌용) */}
      <CuboidCollider args={[0.8, 0.3, 1.5]} />
    </RigidBody>
  );
}

interface CarProps {
  carRef: React.RefObject<any>;
}

export default Car;
