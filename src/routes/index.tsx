import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
} from "react-router-dom";
import { Feedback } from "src/interfaces/Feedback";
import {
  getFeedbackList,
  getCurrentUser,
  updateFeedbackById,
  updateCurrentUser,
} from "@api/FeedbackAPI";
import HomePage from "../pages/Home";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const sortBy = url.searchParams.get("sortBy") ?? "";
  const feedbackListPromise = getFeedbackList(q, sortBy);
  const currentUserPromise = getCurrentUser();

  return defer({
    data: Promise.all([feedbackListPromise, currentUserPromise]),
    q,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const feedbackId = formData.get("feedbackId")?.toString();
  if (!feedbackId) {
    throw new Error("Feedback id missing");
  }
  const upVoted = formData.get("upVoted") === "true";
  const currentUser = await getCurrentUser();
  const updatedCurrentUser = {
    ...currentUser,
    votes: upVoted
      ? currentUser.votes?.concat({ productRequestId: feedbackId, voted: "up" })
      : currentUser.votes?.filter(
          (vote) => vote.productRequestId !== feedbackId
        ),
  };
  await updateCurrentUser(updatedCurrentUser);

  return updateFeedbackById(feedbackId, {
    upvotes: Number(formData.get("upvotes")),
  } as Feedback);
}

export default function RootRoute() {
  return <HomePage />;
}
