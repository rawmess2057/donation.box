import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Donate Now</Button>);
    expect(screen.getByText("Donate Now")).toBeInTheDocument();
  });

  it("renders with primary variant by default", () => {
    const { container } = render(<Button>Click</Button>);
    const btn = container.querySelector("button");
    expect(btn).toHaveClass("bg-primary");
  });

  it("renders with secondary variant", () => {
    const { container } = render(<Button variant="secondary">Click</Button>);
    const btn = container.querySelector("button");
    expect(btn).toHaveClass("border-2");
    expect(btn).toHaveClass("border-accent");
  });

  it("shows loading spinner when loading", () => {
    const { container } = render(<Button loading>Loading</Button>);
    const spinner = container.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("is disabled when loading", () => {
    render(
      <Button loading disabled={false}>
        Test
      </Button>,
    );
    const btn = screen.getByText("Test").closest("button");
    expect(btn).toBeDisabled();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByText("Disabled").closest("button");
    expect(btn).toBeDisabled();
  });

  it("renders icon when provided", () => {
    render(<Button icon={<span data-testid="icon">*</span>}>With Icon</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click Me</Button>);
    await user.click(screen.getByText("Click Me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire click when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>,
    );

    const btn = screen.getByText("Click Me").closest("button");
    await user.click(btn!);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
