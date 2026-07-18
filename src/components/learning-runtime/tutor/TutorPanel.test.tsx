import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import { TutorPanel } from "./TutorPanel";
import { fetchTutorStream } from "@/lib/api/tutor-stream";
import { useTutorStore } from "@/store/useTutorStore";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";

vi.mock("@/lib/api/tutor", () => ({
  tutorApi: {
    chat: vi.fn(),
  },
}));

vi.mock("@/lib/api/tutor-stream", () => ({
  fetchTutorStream: vi.fn((sessionId, options) => {
    options.onToken("This is ");
    options.onToken("a streamed response.");
    options.onDone({ messageId: "msg-stream-id", citations: ["source:lesson-1"] });
    return Promise.resolve();
  }),
}));

describe("TutorPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    useTutorStore.setState({
      isOpen: false,
      messages: [],
      inputValue: "",
      isLoading: false,
      error: null,
      sessionId: "",
      isStreaming: false,
      streamBuffer: "",
      citations: [],
      isOffline: false,
      retryMessage: null,
      abortController: null,
      currentLesson: null,
      currentSection: null,
      currentInteractive: null,
      lessonContext: null,
      tutorRecommendation: null,
    });
  });

  it("does not render panel when closed", () => {
    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);
    expect(screen.queryByLabelText("Gyaneshwara AI Tutor Session")).not.toBeInTheDocument();
  });

  it("renders panel with initial greeting when opened", () => {
    useTutorStore.setState({ isOpen: true });
    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);

    expect(screen.getByLabelText("Gyaneshwara AI Tutor Session")).toBeInTheDocument();
    expect(screen.getByText("Gyaneshwara AI Tutor")).toBeInTheDocument();
    expect(screen.getByText(/Hari Om! I am Gyaneshwara/)).toBeInTheDocument();
  });

  it("renders user and assistant messages properly", () => {
    useTutorStore.setState({
      isOpen: true,
      messages: [
        { id: "1", role: "user", content: "What is Jyotisha?" },
        { id: "2", role: "assistant", content: "Jyotisha is the science of light." },
      ],
    });

    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);
    expect(screen.getByText("What is Jyotisha?")).toBeInTheDocument();
    expect(screen.getByText("Jyotisha is the science of light.")).toBeInTheDocument();
  });

  it("sends message and streams response when user submits prompt", async () => {
    useTutorStore.setState({
      isOpen: true,
      sessionId: "session-123",
      messages: [{ id: "greeting", role: "assistant", content: "Hari Om!" }],
    });
    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);

    const textarea = screen.getByPlaceholderText("Ask a question...");
    fireEvent.change(textarea, { target: { value: "Explain the Vedangas." } });

    const sendButton = screen.getByLabelText("Send message");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetchTutorStream).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          message: expect.stringContaining("Explain the Vedangas."),
          lessonSlug: "jyotisha-as-vedanga",
        })
      );
    });
  });

  it("handles Enter key press to submit message", async () => {
    useTutorStore.setState({
      isOpen: true,
      sessionId: "session-123",
      messages: [{ id: "greeting", role: "assistant", content: "Hari Om!" }],
    });
    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);

    const textarea = screen.getByPlaceholderText("Ask a question...");
    fireEvent.change(textarea, { target: { value: "Tell me about Nakshatras." } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(fetchTutorStream).toHaveBeenCalled();
    });
  });

  it("displays citations when available", () => {
    useTutorStore.setState({
      isOpen: true,
      messages: [{ id: "1", role: "assistant", content: "Citations example" }],
      citations: ["Rig Veda 1.164", "Surya Siddhanta"],
    });

    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);
    expect(screen.getByText("Sources & Citations (2)")).toBeInTheDocument();
  });

  it("shows offline banner when network is disconnected", () => {
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    useTutorStore.setState({ isOpen: true });
    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);

    expect(screen.getByText(/Offline Mode — Message delivery suspended/i)).toBeInTheDocument();
    Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
  });

  it("renders active lesson banner properly formatted", () => {
    useTutorStore.setState({
      isOpen: true,
      currentLesson: "jyotisha-as-vedanga",
    });

    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);
    expect(screen.getByText("Active Context: Jyotisha As Vedanga")).toBeInTheDocument();
  });

  it("renders active section and practice drill context when available", () => {
    useTutorStore.setState({
      isOpen: true,
      currentLesson: "jyotisha-as-vedanga",
      currentSection: "what-jyotisa-is-not",
      currentInteractive: "jyotisha-vs-western",
    });

    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);
    expect(screen.getByText("Active Context: Jyotisha As Vedanga")).toBeInTheDocument();
    expect(screen.getByText("§what-jyotisa-is-not")).toBeInTheDocument();
  });

  it("renders progress indicator when sections are provided", () => {
    useTutorStore.setState({
      isOpen: true,
      currentLesson: "jyotisha-as-vedanga",
    });

    useProgressStore.setState({
      lessons: {
        "jyotisha-as-vedanga": {
          lessonSlug: "jyotisha-as-vedanga",
          attempts: [],
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2"],
          cooldownUntil: null,
          lessonCompletedAt: null,
        },
      },
    });

    const mockSections = [
      { number: "1", title: "Introduction", body: "", group: "Start", type: "hook" },
      { number: "2", title: "Six Limbs", body: "", group: "Learn", type: "mechanics" },
      { number: "3", title: "Visual Map", body: "", group: "Learn", type: "mechanics" },
    ] as any[];

    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" sections={mockSections} />);

    expect(screen.getByText("Progress: 67% (2/3 sections)")).toBeInTheDocument();
    expect(screen.getByText("Status: inprogress")).toBeInTheDocument();
  });

  it("renders proactive Guidance Card when recommendation exists", async () => {
    useTutorStore.setState({
      isOpen: true,
      currentLesson: "jyotisha-as-vedanga",
      tutorRecommendation: {
        recommendation: "Finish the Quiz Activity",
        whySuggested: "Suggested details",
        nextAction: "Complete the remaining quiz questions.",
        type: "retry_quiz",
        priority: "high",
        timestamp: Date.now(),
      },
    });

    render(<TutorPanel lessonSlug="jyotisha-as-vedanga" />);

    expect(screen.getByTestId("tutor-proactive-guidance")).toBeInTheDocument();
    expect(screen.getByText("Gyaneshwara Guidance")).toBeInTheDocument();
    expect(screen.getByText("Finish the Quiz Activity")).toBeInTheDocument();
  });
});
