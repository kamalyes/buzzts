import { randTime } from './time';

describe('randTime', () => {
  it('生成的时间在当前时间之后', () => {
    const now = new Date();
    const t = randTime();
    expect(t.getTime()).toBeGreaterThan(now.getTime());
  });

  it('生成的时间不超过1000小时后', () => {
    const now = new Date();
    const t = randTime();
    const diffHours = (t.getTime() - now.getTime()) / (1000 * 60 * 60);
    expect(diffHours).toBeGreaterThanOrEqual(1);
    expect(diffHours).toBeLessThanOrEqual(1000);
  });
});
