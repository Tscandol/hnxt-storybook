import * as React from 'react';
import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/Alert/Alert.tsx
var SEVERITY_CONFIG = {
  info: {
    textColor: "text-secondary-blue",
    backgroundColor: "#DFF7FF",
    icon: "/icons/info_blue.svg"
  },
  warning: {
    textColor: "text-other-alert-yellow",
    backgroundColor: "#FFF7D8",
    icon: "/icons/danger_yellow.svg"
  },
  error: {
    textColor: "text-secondary-red",
    backgroundColor: "#FFDFDC",
    icon: "/icons/info_red.svg"
  }
};
var alertVariants = cva("relative flex p-4 font-sm", {
  variants: {
    severity: {
      info: "text-secondary-blue",
      warning: "text-other-alert-yellow",
      error: "text-secondary-red"
    },
    fullWidth: {
      true: "w-full",
      false: "w-[400px]"
    }
  },
  defaultVariants: {
    severity: "info",
    fullWidth: true
  }
});
var Alert = React.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      severity = "info",
      fullWidth = true,
      title,
      children
    } = _b, props = __objRest(_b, [
      "className",
      "severity",
      "fullWidth",
      "title",
      "children"
    ]);
    const config = SEVERITY_CONFIG[severity != null ? severity : "info"];
    const hasTitle = !!title;
    return /* @__PURE__ */ React.createElement(
      "div",
      __spreadValues({
        ref,
        className: cn(alertVariants({ severity, fullWidth }), className),
        role: "alert",
        style: {
          backgroundColor: config.backgroundColor
        }
      }, props),
      /* @__PURE__ */ React.createElement("div", { className: cn("relative flex w-full", hasTitle ? "items-start" : "items-center") }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: cn(
            "shrink-0 w-6 flex mr-2",
            hasTitle ? "items-start" : "items-center"
          )
        },
        /* @__PURE__ */ React.createElement(
          Image,
          {
            src: config.icon,
            alt: `${severity} icon`,
            width: 24,
            height: 24
          }
        )
      ), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, title && /* @__PURE__ */ React.createElement("div", { className: "font-medium" }, title), /* @__PURE__ */ React.createElement("div", { className: "text-alert" }, children)))
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
