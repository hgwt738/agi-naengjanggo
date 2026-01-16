import type {AgeGroup} from '../types';

export function calculateMonthsOld(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();

  // 아직 그 달의 생일이 안 지났으면 1개월 빼기
  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function getAgeGroup(monthsOld: number): AgeGroup {
  if (monthsOld < 7) {
    return '초기';
  } else if (monthsOld < 9) {
    return '중기';
  } else if (monthsOld < 12) {
    return '후기';
  } else {
    return '완료기';
  }
}

export function getAgeGroupDescription(ageGroup: AgeGroup): string {
  const descriptions: Record<AgeGroup, string> = {
    초기: '4-6개월 · 미음, 퓨레 형태',
    중기: '7-8개월 · 으깬 형태, 알갱이 시작',
    후기: '9-11개월 · 잘게 다진 형태',
    완료기: '12개월 이상 · 유아식 전환',
  };
  return descriptions[ageGroup];
}

export function formatMonthsOld(monthsOld: number): string {
  if (monthsOld < 12) {
    return `${monthsOld}개월`;
  }
  const years = Math.floor(monthsOld / 12);
  const remainingMonths = monthsOld % 12;
  if (remainingMonths === 0) {
    return `${years}살`;
  }
  return `${years}살 ${remainingMonths}개월`;
}
