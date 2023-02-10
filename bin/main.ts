#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HogeStack } from "../lib/hoge-stack";

const app = new cdk.App();
new HogeStack(app, "HogeStack");
