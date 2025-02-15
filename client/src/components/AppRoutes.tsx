import { routes } from "@client/clientConstants";
import { FourOhFour } from "@client/components/FourOhFour";
import { HelloWorldRoute } from "@client/components/HelloWorldRoute";
import { HomeRoute } from "@client/components/HomeRoute";
import { SignInRoute } from "@client/components/SignInRoute";
import { Route, Switch } from "wouter";

export function AppRoutes() {
  return (
    <Switch>
      <Route path={routes.helloWorld} component={HelloWorldRoute} />
      <Route path={routes.signIn} component={SignInRoute} />
      <Route path={routes.root} component={HomeRoute} />
      <Route component={FourOhFour} />
    </Switch>
  );
}
