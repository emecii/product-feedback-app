import { ActionFunctionArgs, redirect } from "react-router-dom";
import FeedbackNewPage from "../../pages/FeedbackNew";
import { addNewFeedback } from "@api/FeedbackAPI";
import { Feedback } from "src/interfaces/Feedback";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const feedback = {
    id: crypto.randomUUID(),
    title: updates.title,
    category: updates.category,
    upvotes: 0,
    status: "Planned",
    description: updates.description,
    commentCount: 0,
  } as Feedback;

  await addNewFeedback(feedback);
  return redirect(`../feedback/${feedback.id}`);
}

function FeedbackNewRoute() {
  return <FeedbackNewPage />;
}

export default FeedbackNewRoute;
