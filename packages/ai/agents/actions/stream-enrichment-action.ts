
//     "use server";

//     import { streamUI } from "streamui";
//     import { AgentComponent } from "../components/AgentComponent";
//  // Example, see below

//     export async function agentStreamAction(formData: FormData) {
//       // The input could come from a form; adjust as needed.
//       const prompt = formData.get("prompt") as string;

//       // streamUI returns a Streamable UI component as the agent 
// responds.
//       return streamUI(async (push) => {
//         // Any logic to incrementally yield UI
//         push(<AgentComponent status="thinking" progress={0} />);
//         await new Promise((r) => setTimeout(r, 1000)); // Simulate
//  agent latency
//         push(<AgentComponent status="in-progress" progress={50} 
// />);
//         await new Promise((r) => setTimeout(r, 1500));
//         push(<AgentComponent status="complete" progress={100} 
// result="Done!" />);
//         // Usually, you’d yield from within async AI/LLM event 
// loop here.
//       });