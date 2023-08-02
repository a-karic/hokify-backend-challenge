import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from "./locale/en";
import themes from './themes';

interface IJsonInputProps {
  placeholder: {};
  onChange: (jsonObject: {}, error: boolean) => void;
}

export const JsonInput = (props: IJsonInputProps) => {

  const {
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
          height='150px'
          onChange={handleOnChange}
      />
    );
  } catch (error) {
    // Log the error and return a fallback UI
    console.error(error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
