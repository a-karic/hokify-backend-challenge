import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from "./locale/en";
import themes from './themes';

interface IJsonInputProps {
  placeholder: {};
  height?: number;
  width?: number;
  onChange: (jsonObject: {}, error: boolean) => void;
}

export const JsonInput = (props: IJsonInputProps) => {

  const {
    height = 150,
    width = 350,
    placeholder,
    onChange,
  } = props;

  const handleOnChange = (val: any) => {
    onChange(val.jsObject as {}, !!val.error as boolean);
  };

  try {
    return (
        <JSONInput
          placeholder={ placeholder }
          locale={ locale }
          colors={themes.light_mitsuketa_tribute}
          height={`${height}px`}
          width={`${width}px`}
          onChange={handleOnChange}
      />
    );
  } catch (error) {
    // Log the error and return a fallback UI
    console.error(error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
