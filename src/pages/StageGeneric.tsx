import { useParams } from "react-router-dom";
import StageRegistrationForm from "@/components/StageRegistrationForm";

export default function StageGeneric() {
  const { slug } = useParams();
  return <StageRegistrationForm key={slug} slug={slug} />;
}
