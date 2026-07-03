import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgressBar from "@/components/ui/ProgressBar";

describe("ProgressBar", () => {
  it("displays correct percentage", () => {
    render(<ProgressBar value={50} max={100} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("displays label when provided", () => {
    render(<ProgressBar value={30} max={100} label="Raised" />);
    expect(screen.getByText("Raised")).toBeInTheDocument();
  });

  it("caps at 100%", () => {
    render(<ProgressBar value={200} max={100} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows 0% for zero value", () => {
    render(<ProgressBar value={0} max={100} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<ProgressBar value={40} max={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders milestone markers", () => {
    const milestones = [
      { at: 25, label: "25%" },
      { at: 50, label: "50%" },
    ];
    render(<ProgressBar value={60} max={100} milestones={milestones} />);

    expect(screen.getByText(/25%/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });
});
