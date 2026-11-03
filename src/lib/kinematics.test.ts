import test from "node:test";
import assert from "node:assert/strict";
import {
  AE_SNAP,
  AE_WHIP,
  buildArcLengthSpline,
  computeReveal,
  formatAnimatedNumber,
  impulseRecoil,
  sampleArcLengthSpline,
  solveCubicBezierParameter,
  springODE,
} from "./kinematics";
import { evaluateXCamera, SCENES, TOTAL_DURATION } from "./timeline";

test("Cubic-Bezier solver inverts Bx(u)=x accurately across domain", () => {
  assert.equal(solveCubicBezierParameter(0, 0.16, 0.3), 0);
  assert.equal(solveCubicBezierParameter(1, 0.16, 0.3), 1);
  const mid = AE_SNAP(0.5);
  assert.ok(mid > 0.8 && mid < 1.0, `Expected AE_SNAP(0.5) > 0.8, got ${mid}`);
  const whipMid = AE_WHIP(0.5);
  assert.ok(Math.abs(whipMid - 0.5) < 0.02);
});

test("Spring ODE settles to 1.0 and exhibits underdamped overshoot", () => {
  const s0 = springODE(0, 20, 0.7);
  assert.equal(s0.value, 0);
  const sPeak = springODE(0.18, 24, 0.62);
  assert.ok(sPeak.value > 1.0, "Underdamped spring should overshoot > 1.0");
  const sSettled = springODE(4.5, 20, 0.75);
  assert.ok(Math.abs(sSettled.value - 1.0) < 1e-3);
});

test("Arc-length spline parameterizes constant distance accurately", () => {
  const spline = buildArcLengthSpline([
    { x: 100, y: 500 },
    { x: 500, y: 300 },
    { x: 900, y: 100 },
  ]);
  assert.ok(spline.totalLength > 800);
  const start = sampleArcLengthSpline(spline, 0);
  const end = sampleArcLengthSpline(spline, 1);
  assert.ok(Math.abs(start.x - 100) < 1);
  assert.ok(Math.abs(end.x - 900) < 1);
});

test("Timeline invariants: contiguous beats, valid duration, no duplicate adjacent transitions", () => {
  assert.equal(SCENES[0].start, 0);
  assert.equal(SCENES[SCENES.length - 1].end, TOTAL_DURATION);

  for (let i = 0; i < SCENES.length; i++) {
    const b = SCENES[i];
    const dur = b.end - b.start;
    assert.ok(dur >= 6.0 && dur <= 20.0, `Beat ${b.id} duration ${dur} out of [6, 20] range`);
    if (i > 0) {
      assert.equal(b.start, SCENES[i - 1].end, `Beat ${b.id} not contiguous with ${SCENES[i - 1].id}`);
      assert.notEqual(
        b.transition,
        SCENES[i - 1].transition,
        `Beat ${b.id} repeats transition ${b.transition}`
      );
    }
  }
});

test("Camera solver composites incoming and outgoing beats at cut boundaries", () => {
  const midBeat = evaluateXCamera(4.0);
  assert.equal(midBeat.activeBeats.length, 1);
  assert.equal(midBeat.primaryBeat.id, "B01_HOOK_TAP");

  const atCut = evaluateXCamera(8.1);
  assert.equal(atCut.activeBeats.length, 2);
  assert.ok(atCut.shutterBlurX > 0, "Expected horizontal shutter motion blur during whip-right");
});

test("Reveal, recoil, and animated counters are deterministic functions of t", () => {
  const before = computeReveal(5.0, 6.0);
  assert.equal(before.opacity, 0);
  const after = computeReveal(6.8, 6.0);
  assert.ok(after.opacity > 0.99);
  assert.ok(impulseRecoil(0.05) !== 0);
  assert.equal(formatAnimatedNumber(10, 5, 2, 0, 4447, 0), "4,447");
});
