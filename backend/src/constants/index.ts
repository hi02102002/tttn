export const scoreTenToFour = (score: number) => {
  if (score < 4) {
    return 0;
  }

  if (score <= 4.7 && score >= 4) {
    return 1;
  }

  if (score <= 5.4 && score >= 4.8) {
    return 1.5;
  }

  if (score <= 6.2 && score >= 5.5) {
    return 2;
  }

  if (score <= 6.9 && score >= 6.3) {
    return 2.5;
  }

  if (score <= 7.7 && score >= 7) {
    return 3;
  }

  if (score <= 8.4 && score >= 7.8) {
    return 3.5;
  }

  if (score <= 8.9 && score >= 8.5) {
    return 3.7;
  }

  if (score <= 10 && score >= 9) {
    return 4;
  }
};

export const scoreTenToLetter = (score: number) => {
  const map = {
    0: 'F',
    1: 'D',
    1.5: 'D+',
    2: 'C',
    2.5: 'C+',
    3: 'B',
    3.5: 'B+',
    3.7: 'A',
    4: 'A+',
  };

  return map[scoreTenToFour(score)];
};

export const scoreTenToAcademicRank = (score: number) => {
  const scoreFour = scoreTenToFour(score);

  if (scoreFour < 2) {
    return 'Kém';
  }

  if (scoreFour >= 2 && scoreFour < 2.5) {
    return 'Trung bình';
  }

  if (scoreFour >= 2.5 && scoreFour < 3.2) {
    return 'Khá';
  }

  if (scoreFour >= 3.2 && scoreFour < 3.6) {
    return 'Giỏi';
  }

  return 'Xuất sắc';
};
