import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import DonationPanel from "@/components/campaigns/DonationPanel";

describe("DonationPanel", () => {
  it("renders preset donation amounts", () => {
    render(<DonationPanel raised={10} goal={100} />);
    expect(screen.getByText("0.1 SOL")).toBeInTheDocument();
    expect(screen.getByText("0.5 SOL")).toBeInTheDocument();
    expect(screen.getByText("1 SOL")).toBeInTheDocument();
    expect(screen.getByText("2 SOL")).toBeInTheDocument();
  });

  it("shows progress percentage", () => {
    render(<DonationPanel raised={25} goal={100} />);
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("shows amount remaining", () => {
    render(<DonationPanel raised={30} goal={100} />);
    expect(screen.getByText(/70 SOL remaining/)).toBeInTheDocument();
  });

  it("calls onDonate when donate button clicked with preset amount", async () => {
    const handleDonate = vi.fn();
    const user = userEvent.setup();

    render(
      <DonationPanel raised={10} goal={100} onDonate={handleDonate} />,
    );

    const donateBtn = screen.getByText(/Donate/);
    await user.click(donateBtn);

    expect(handleDonate).toHaveBeenCalledWith(0.5, "SOL");
  });

  it("shows error for amount below minimum", async () => {
    const user = userEvent.setup();

    render(<DonationPanel raised={10} goal={100} minDonation={0.1} />);

    const input = screen.getByPlaceholderText("0.00");
    await user.type(input, "0.01");

    expect(
      screen.getByText(/Minimum donation is 0.1 SOL/),
    ).toBeInTheDocument();
  });

  it("shows USD conversion for entered amount", async () => {
    const user = userEvent.setup();

    render(<DonationPanel raised={10} goal={100} />);

    const input = screen.getByPlaceholderText("0.00");
    await user.type(input, "1");

    expect(screen.getByText(/\$145 USD/)).toBeInTheDocument();
  });
});
