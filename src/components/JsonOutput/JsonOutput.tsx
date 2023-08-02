import React from 'react';
import JsonFormatter from 'react-json-formatter'

interface IJsonFormatterProps {
    jsonValue: {};
}

export const JsonOutput = (props: IJsonFormatterProps) => {

  const {
    jsonValue,
  } = props;

  try {
    return <JsonFormatter json={jsonValue} />

  } catch (error) {
    // Log the error and return a fallback UI
    console.error(error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
