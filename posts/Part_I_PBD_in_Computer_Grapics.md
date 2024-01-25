---
title: "Part I PBD in Computer Graphics"
date: "2023-01-01"
comment: 🌿 the basics motion equation and integration methods of PBD 🌿
tags: ["PBD"]
preview: "/papers/pbd_in_cg.png"
authors: ["Jan Bender", "Matthias Müller", "Miles Macklin"]
year: 2015
---

## Resources:

- [[Paper](http://mmacklin.com/EG2015PBD.pdf)]
- [[slides](http://mmacklin.com/flex_eurographics_tutorial.pdf)]

## Part 1: Background

In this section, we first introduce the basics of PBD, including

- Equations of Motion
- Time Integration
- Constraints

## 🌟 Equations of Motion

Let’s start with a **`particle`** $i$, which has three attributes **`mass`** $m_i$, **`position`** $\bold x_i$, **`velocity`** $\bold v_i$.

From Newton’s second law, we know that the equation of motion of a particle is:

$$
\begin{align}\dot {\bold v_i} = \frac{1}{m_i}\bold f_i\end{align}
$$

where $\bold f_i$ is the sum of all **forces** acting on a particle $i$. The relationship between $\dot {\bold x}$ and $\dot {\bold v}$ is:

$$
\begin{align}\dot {\bold x_i} = \bold v_i\end{align}
$$

**From Particle → Rigid Body:**

Compared to particles, except for 3 **translational** degrees of freedom, rigid bodies also have 3 **rotational** ones.

- **Inertia** tensor $\bold I_i \in \mathbb R^{3\times 3}$
- **Orientation** (a unit quaternion) $\bold q_i \in \mathbb H$
- **Angular** velocity $\omega_i \in \mathbb R^3$.

Expand Newton’s second law to rigid bodies: viewing rigid bodies as a collection of infinite numbers of particles. The equations of motion for rigid bodies are also known as the **Newton-Euler** equations. The equation of motion for the **rotational** part of a rigid body:

$$
\begin{align}\dot {\bold \omega_i} = \bold I_i^{-1}(\tau_i - (\omega_i \times(\bold I_i \omega_i)))\end{align}
$$

where $\tau_i$ is the sum of all moments.

If the force $\bold f$ acts at a point $\bold p$ and $\bold x$ is the center of mass of the body, the moment $\tau = (\bold p - \bold x) \times \bold f$, also known as a pure moment.

The velocity kinematic relationship for the rotational part:

$$
\begin{align}\dot {\bold q_i} = \frac{1}{2}\tilde \omega_i \bold q_i\end{align}
$$

$\tilde \omega$ the quaternion $[0, \omega_i^x,  \omega_i^y,  \omega_i^z]$.

## 🌟 Time Integration

A simulation step for **an unconstrained particle or rigid body** is performed by numerical integration of Equations `(1)-(2)` or Equations `(1)-(4)`, respectively. The most popular integration method in the field of position-based dynamics is **`the symplectic Euler method`,** which uses the velocity at time $t_0 + \Delta t$ for the integration of the position vector.

The time integration for a particle:

$$
\bold v_i(t_0 + \Delta t) = \bold v_i(t_0) + \Delta t \frac{1}{m_i}\bold f_i(t_0) \\
\bold x_i(t_0 + \Delta t) = \bold x_i(t_0) + \Delta t \bold v_i(t_0 + \Delta t)
$$

In the case of a rigid body:

$$
\begin{aligned}
\bold \omega_i(t_0 + \Delta t) &= \bold \omega_i(t_0) + \Delta t \bold I_i^{-1}(t_0)(\tau_i(t_0) - (\omega_i(t_0) \times(\bold I_i(t_0) \omega_i(t_0)))) \\
\bold q(t_0 + \Delta t) &= \bold q(t_0) + \Delta t\frac{1}{2}\tilde \omega_i(t_0 + \Delta t) \bold q_i(t_0) \\
||\bold q|| &= 1
\end{aligned}
$$

☘️ Notice: the condition $||\bold q|| = 1$ might be violated after the integration due to numerical errors. Since the quaternion represents a rotation, so it must be normalized after each step.

## 🌟 Constraints

Constraints are **kinematic restrictions** in the form of equations and inequalities that constrain the relative motion of bodies.

**`Equality`** and **`inequality`** constraints are referred to as **bilateral** and **unilateral** constraints, respectively.

PBD methods only consider constraints that depend on **`positions`** and in the case of rigid bodies on **`orientations`**.

A bilateral constraint is defined by a function

$$
C(\bold x_{i1}, \bold q_{i1},..., \bold x_{in_j}, \bold q_{in_j}) = 0
$$

A unilateral constraint is defined by a function

$$
C(\bold x_{i1}, \bold q_{i1},..., \bold x_{in_j}, \bold q_{in_j}) \geq 0
$$

where $\{i_1, …, i_{n_j}\}$ is a set of indices and $n_j$ is the cardinality of the constraint;

Force-based method:

✨ Define a potential energy $E = \frac{k}{2}C^2$

✨ Deriving the forces as $\bold f = -\nabla E$(soft constraints)

✨ or via **Lagrangian multipliers** derived from **constrained dynamics**(hard constraints)

Position-based method

✨ modify the positions and orientations of the bodies directly in order to fulfill all constraints
