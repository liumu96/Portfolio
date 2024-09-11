---
title: "Part III PBD in Computer Graphics"
date: "2023-01-01"
comment: 🌿  🌿
tags: ["Position Based Dynamics"]
preview: "/papers/how_to_read_a_paper.png"
---

## Resources:

- [[Paper](http://mmacklin.com/EG2015PBD.pdf)]
- [[slides](http://mmacklin.com/flex_eurographics_tutorial.pdf)]

## Part 3: Specific Constraints

In this section, we will introduce different constraints to simulate different materials such as articulated rigid bodies, soft bodies, cloth or even fluids with PBD.

For readability, we define $\bold x_{i,j} = \bold x_i - \bold x_j$

## 🌟 Stretching

![Figure 3: Projection of the constraint $C(\bold x_1, \bold x_2) = |\bold x_{1,2}| − d$. The corrections $∆\bold x_i$ are weighted according to the inverse masses $w_i = 1/m_i$.](Position-Based%20Simulation%20Methods%20in%20Computer%20Grap%206de1e732e2af4386854ae6832a74e398/Untitled%202.png)

Figure 3: Projection of the constraint $C(\bold x_1, \bold x_2) = |\bold x_{1,2}| − d$. The corrections $∆\bold x_i$ are weighted according to the inverse masses $w_i = 1/m_i$.

1. The final corrections

   $$
   \Delta \bold x_1 = - \frac{w_1}{w_1 + w_2}(|\bold x_{1, 2}| - d) \bold n \\
   \Delta \bold x_2 = + \frac{w_2}{w_1 + w_2}(|\bold x_{1, 2}| - d) \bold n
   $$

1. The distance constraint function:

   $$
   C(\bold x_1, \bold x_2) = |\bold x_{1, 2}| - d
   $$

1. The derivatives with respect to the points:

   $$
   \nabla_{\bold x_1}C(\bold x_1, \bold x_2) = \bold n \\
   \nabla_{\bold x_2}C(\bold x_1, \bold x_2) = -\bold n \\
   \bold n = \frac{\bold x_{1,2}}{|\bold x_{1,2}|}
   $$

1. The scaling factor $\lambda$ is

   $$
   \lambda = \frac{|\bold x_{1,2}| - d}{1 + 1}
   $$

## 🌟 Bending

![Untitled](Position-Based%20Simulation%20Methods%20in%20Computer%20Grap%206de1e732e2af4386854ae6832a74e398/Untitled%203.png)

## Isometric Bending

![Untitled](Position-Based%20Simulation%20Methods%20in%20Computer%20Grap%206de1e732e2af4386854ae6832a74e398/Untitled%204.png)

## 5.4 Collisions

Triangle Collisions

![Untitled](Position-Based%20Simulation%20Methods%20in%20Computer%20Grap%206de1e732e2af4386854ae6832a74e398/Untitled%205.png)

## 5.5 Volume Conservation

Tetrahedral Meshes

Cloth Balloons

Surface Meshes

Robust Collision Handling with Air Meshes

## 5.6 Long Range Attachments

## 5.7 Strands

## 5.8 Continuous Materials

## 5.9 Rigid Body Dynamics

→ simulate articulated rigid body systems with joint and contact constraints

- For a rigid body, parameterize the rotation by a vector $\vartheta$ which represents a rotation of $|\vartheta|$ about the axis $\vartheta/|\vartheta|$ in order to define constraint function $\bold C(\bold x, \vartheta)$ for positions and orientations.
  $$
  C(\bold x + \Delta \bold x, \vartheta + \Delta \vartheta) \approx C(\bold x, \vartheta) + \bold J(\bold x, \vartheta) (\Delta \bold x^T, \Delta \vartheta^T)^T
  $$
- Connector
- Example: Ball Joint : $\bold C(\bold P_1, \bold P_2) = \bold P_1 - \bold P_2 = \bold 0$, where $\bold P_1$ and $\bold P_2$ are connector points in the first and second body, respectively.
- The world space position of a connector point $\bold P_i$ of a body $j$ with position $\bold x_j$ and orientation $\vartheta_j$ is defined by:
  $$
  \begin{align}
  \bold P_i(\bold x_j, \vartheta_j) =\bold x_j + \bold R(\vartheta_j)\bold r_i
  \end{align}
  $$
  $\bold r_i$ denotes the position of the connector in the local coordinate system of the body.
- The Jacobian of a constraint function $\bold C(\bold P)$ which depends on a set of connector points $\bold P$:
  $$
  \bold J = \underbrace{\frac{\partial \bold C(\bold P)}{\partial \bold P}}_{constraint\text{ } specific \text{ }part} \cdot \underbrace{\left(\frac{\partial \bold P}{\partial \bold x}\frac{\partial \bold P}{\partial \vartheta}\right)^T}_{connecotr \text{ } specific \text{ } part}
  $$
- Example: Ball Joint: $\partial \bold C(\bold P)/\partial \bold P_1 = - \partial \bold C(\bold P)/\partial \bold P_2 = \bold I$. $\partial \bold P / \partial \bold x = \bold I$, $\partial \bold p / \partial \vartheta$ → $\partial \bold R(\vartheta)/\partial \vartheta$.
- Lagrange multiplier $\lambda$:
  $$
  \begin{align}
  \bold J\bold M^{-1}\bold J^T\lambda = -\bold C(\bold x, \vartheta)
  \end{align}
  $$
  $$
  \begin{align}
  \left[\Delta \bold x^T, \Delta \vartheta ^T\right] = \bold M^{-1}\bold J^T\lambda
  \end{align}
  $$

## 5.10 Fluids

- fluid incompressibility is enforced using density constraints
- a density constraint for each particle $i$ in the systems
  $$
  \begin{align}
  C_i(\bold x_1, ..., \bold x_n) = \frac{\rho_i}{\rho_0} - 1
  \end{align}
  $$
  $\rho_0$: the fluid rest density; $\rho_i$: the density at a particle, defines as the sum of smooth kernels centered at the particle’s neighbor positions
  $$
  \begin{align}
  \rho_i = \sum_jm_jW(\bold x_i - \bold x_j, h)
  \end{align}
  $$
  the derivative of the constraint:
  $$
  \nabla_{\bold x_k} C_i = \frac{1}{\rho_1}
  \begin{cases}
  \sum_j \nabla _{\bold x_k} W(\bold x_i - \bold x_j, h), & \text{if }k\text{ = } i\\
  -\nabla_{\bold x_k} W(\bold x_i - \bold x_j, h), & \text{if }k\text{ = }j
  \end{cases}
  $$
  the corrective change in position due to the particle’s own density constraint and the density constraints of its neighbors is given by:
  $$
  \Delta \bold x_i = \frac{1}{\rho_0}\sum_j(\lambda_i + \lambda_j)\nabla W(\bold x_i - \bold x_j, h)
  $$

## 5.11 Shape Matching

Shape matching is a mesh-less approach which is able to simulate visually plausible elastic and plastic deformations.

### 5.11.1 Goal Positions

### 5.11.2 Region-Based Shape Matching

### 5.11.6. Cloth Simulation

## 6. Implementation

## 7. Applications

## 8. Conclusion

## Math Equations

- Particle $i$: mass $m_i$, position $\bold x_i$, velocity $\bold v_i$
- the equation of motion of a particle:
  $$
  \begin{align}\dot {\bold v_i} = \frac{1}{m_i}\bold f_i\end{align}
  $$
  $\bold f_i$ : the sum of all forces acting on a particle $i$
- the velocity kinematic relationship:

$$
\begin{align}\dot {\bold x_i} = \bold v_i\end{align}
$$

- Rigid Body: inertia tensor $\bold I_i \in \mathbb R^{3\times 3}$, orientation (a unit quaternion) $\bold q_i \in \mathbb H$, angular velocity $\omega_i \in \mathbb R^3$.
- the equation of motion for the rotational part of a rigid body:
  $$
  \begin{align}\dot {\bold \omega_i} = \bold I_i^{-1}(\tau_i - (\omega_i \times(\bold I_i \omega_i)))\end{align}
  $$
  $\tau_i$ is the sum of all moments. pure moment or byproduct of a force $\tau = (\bold p - \bold x) \times \bold f$
- the velocity kinematic relationship for the rotational part:

  $$
  \begin{align}\dot {\bold q_i} = \frac{1}{2}\tilde \omega_i \bold q_i\end{align}
  $$

  $\tilde \omega$ the quaternion $[0, \omega_i^x,  \omega_i^y,  \omega_i^z]$.

-
