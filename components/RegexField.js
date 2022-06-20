import React, { useRef } from 'react';
import { Button, Input, styled } from '@nextui-org/react';

const RegexField = ({ essenceRegex }) => {
  const regexInputRef = useRef(null);
  const onInputClick = () => {
    regexInputRef.current.select();
  };

  const onButtonClick = (e) => {
    console.log(regexInputRef.current.value);
    navigator.clipboard.writeText(regexInputRef.current.value);
  };

  const InputFieldContainer = styled('div', {
    display: 'flex',
    marginTop: '12px',
  });

  const CopyRegexButton = styled(Button, {
    borderRadius: '0 20px 20px 0',
  });

  return (
    <InputFieldContainer>
      <Input
        onClick={onInputClick}
        ref={regexInputRef}
        readOnly
        initialValue={`"of (${essenceRegex})"`}
        width={'300px'}
        contentRight={
          <CopyRegexButton onClick={onButtonClick} auto>
            Copy
          </CopyRegexButton>
        }
      />
    </InputFieldContainer>
  );
};

export default RegexField;
