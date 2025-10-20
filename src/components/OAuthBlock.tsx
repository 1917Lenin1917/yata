import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/GoogleIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import YandexIcon from "@/components/icons/YandexIcon";

interface Props {
  oauthAction(provider: string): void;
}
export default function OAuthBlock({ oauthAction }: Props) {
  return (
    <div className={"flex flex-wrap gap-2"}>
      <Button
        type="button"
        onClick={() => oauthAction("google")}
        className={"grow cursor-pointer"}
      >
        <GoogleIcon />
      </Button>
      <Button
        type="button"
        onClick={() => oauthAction("github")}
        className={"grow cursor-pointer"}
      >
        <GithubIcon />
      </Button>
      <Button
        type="button"
        onClick={() => oauthAction("yandex")}
        className={"grow cursor-pointer"}
      >
        <YandexIcon />
      </Button>
    </div>
  );
}
