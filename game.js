let currentRound = 0;
const MAX_ROUNDS = 10;

function nextRound() {
  if (++currentRound >= MAX_ROUNDS) {
    triggerBadEnding(); // 触发结局
  }
}
