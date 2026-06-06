/**
 * Tests del componente HabitRow.
 *
 * Truco: las server actions reales (toggleCheckInToday, deleteHabit) usan
 * next/headers y Supabase, que no funcionan en el entorno de tests.
 * Por eso las mockeamos: las reemplazamos por funciones falsas que solo
 * registran que las llamaron.
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HabitRow } from "./HabitRow"

// Mock de las server actions. Estas funciones falsas vuelven undefined
// (lo mismo que devuelven las reales cuando todo sale OK).
vi.mock("./actions", () => ({
  toggleCheckInToday: vi.fn(async () => {}),
  deleteHabit: vi.fn(async () => {}),
}))

import { toggleCheckInToday, deleteHabit } from "./actions"

describe("HabitRow", () => {
  it("muestra el nombre del hábito", () => {
    render(<HabitRow id="h1" name="leer 20 min" doneToday={false} />)
    expect(screen.getByText("leer 20 min")).toBeInTheDocument()
  })

  // Buscamos el check por su marca data-check (la fila tiene otros SVG:
  // el ícono del hábito y, si hay racha, la llama).
  it("NO muestra el check cuando doneToday=false", () => {
    const { container } = render(
      <HabitRow id="h1" name="leer" doneToday={false} />,
    )
    expect(container.querySelector("[data-check]")).not.toBeInTheDocument()
  })

  it("muestra el check cuando doneToday=true", () => {
    const { container } = render(
      <HabitRow id="h1" name="leer" doneToday={true} />,
    )
    expect(container.querySelector("[data-check]")).toBeInTheDocument()
  })

  it("tacha el texto cuando doneToday=true", () => {
    render(<HabitRow id="h1" name="leer" doneToday={true} />)
    expect(screen.getByText("leer")).toHaveClass("line-through")
  })

  it("llama a toggleCheckInToday al clickear el círculo", async () => {
    const user = userEvent.setup()
    render(<HabitRow id="h1" name="leer" doneToday={false} />)

    await user.click(screen.getByRole("button", { name: /marcar como hecho hoy/i }))

    expect(toggleCheckInToday).toHaveBeenCalledWith("h1")
  })

  it("llama a deleteHabit al clickear la ✕", async () => {
    const user = userEvent.setup()
    render(<HabitRow id="h1" name="leer" doneToday={false} />)

    await user.click(screen.getByRole("button", { name: /borrar hábito/i }))

    expect(deleteHabit).toHaveBeenCalledWith("h1")
  })
})
