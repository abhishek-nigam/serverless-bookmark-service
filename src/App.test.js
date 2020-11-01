import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders bookmark service header", () => {
  render(<App />);
  const ele = screen.getByText(/Bookmark Service/i);
  expect(ele).toBeInTheDocument();
});
