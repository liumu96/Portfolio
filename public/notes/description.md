### Physics Background

- Newton’s $2^{nd}$ law:

$$
F = ma
$$

- The simplest force is gravity:

$$
G = m\cdot g \text{ } (g \approx 9.8 m/s^2) \\
a = f / m \\
a = g \approx 9.8 m/s^2
$$

- Using the **Acceleration** to update Velocity and Position.
  In this demo we use \***\*Symplectic Euler Time Integration:\*\*** updating the velocity before the position in order to get a stable simulation
  - First take an explicit velocity step
    $$
    x^{t+1} = x^t + \Delta t * v^{t+1}
    $$
  - Next take an implicit position step
    $$
    v^{t+1} = v^t + \Delta t * a^{t+1}
    $$
- The problem with this idea is that we assume the force as well as the velocity are constant during the entire time step. While it’s true for the gravitational force, it’s not true for the velocity, which means we introduce a small error every time step.
- The question is how can we make this error small?
  - Find formula with calculus : only for toy problems ❌
  - More sophisticated integration: Slower, no improvement when collision occur ❌
  - Make $\Delta t$ small : simple, work great! ✅

### Simulation:

- The physics quantities

```jsx
float x = 0.0.   // m
float v = 10.0   // m/s
float g = -9.8   // m/s^2
float dt = 1.0 / 60.0  // s
```

- update

```jsx
while simulate
	v = v + g * dt
	x = x + v * dt
end while
```

- Substepping

```jsx
int n = 5;
float sdt = dt / n

while simulate
	for n substeps
		v = v + g * dt
		x = x + v * dt
	endfor
endwhile
```

### Key Code

```jsx
simulate({ ball, gravity, timeStep, simWidth, simHeight }) {
    ball.vel.x += gravity.x * timeStep;
    ball.vel.y += gravity.y * timeStep;
    ball.pos.x += ball.vel.x * timeStep;
    ball.pos.y += ball.vel.y * timeStep;

    if (ball.pos.x < ball.radius) {
      ball.pos.x = ball.radius;
      ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.x > simWidth - ball.radius) {
      ball.pos.x = simWidth - ball.radius;
      ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.y < ball.radius) {
      ball.pos.y = ball.radius;
      ball.vel.y = -ball.vel.y;
    }
    if (ball.pos.y > simHeight - ball.radius) {
      ball.pos.y = simHeight - ball.radius;
      ball.vel.y = -ball.vel.y;
    }
  }
```
