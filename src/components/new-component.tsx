import React, {FC, ReactNode} from 'react';

type NewComponentProp = {
  component: ReactNode;
}

const newComponent: FC<NewComponentProp> = (props) => {
  return (
    <>
      {props.component}
    </>
  );
};

export default newComponent;