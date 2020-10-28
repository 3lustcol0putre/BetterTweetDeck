import {css} from 'emotion';
import React, {PropsWithChildren} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsToggle} from './settingsToggle';

interface BooleanSettingsRowProps {
  initialValue: boolean;
  onChange: HandlerOf<boolean>;
  id: string;
}

export function BooleanSettingsRow(props: PropsWithChildren<BooleanSettingsRowProps>) {
  return (
    <div className={settingsRow}>
      <span className={settingsRowTitle}>{props.children}</span>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsToggle
          id={props.id}
          name={props.id}
          defaultChecked={props.initialValue}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}
