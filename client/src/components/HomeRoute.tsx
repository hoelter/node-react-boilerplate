import { routes } from "@client/clientConstants";
import { Redirect } from "wouter";

export function HomeRoute() {
  return <Redirect to={routes.helloWorld} />;
}
