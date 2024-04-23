/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/EtherealEngine/etherealengine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Ethereal Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Ethereal Engine team.

All portions of the code written by the Ethereal Engine team are Copyright © 2021-2023 
Ethereal Engine. All Rights Reserved.
*/

import React from 'react'
import { useTranslation } from 'react-i18next'

import { HemisphereLightComponent } from '@etherealengine/spatial/src/renderer/components/HemisphereLightComponent'

import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import {
  EditorComponentType,
  commitProperty,
  updateProperty
} from '@etherealengine/editor/src/components/properties/Util'
import ColorInput from '../../../../../primitives/tailwind/Color'
import InputGroup from '../../../input/Group'
import NumericInput from '../../../input/Numeric'
import NodeEditor from '../../nodeEditor'

/**
 * HemisphereLightNodeEditor used to provide property customization view for Hemisphere Light.
 */
export const HemisphereLightNodeEditor: EditorComponentType = (props) => {
  const { t } = useTranslation()

  //const lightComponent = useComponent(props.entity, HemisphereLightComponent).value

  return (
    <NodeEditor
      {...props}
      name={t('editor:properties.hemisphere.name')}
      description={t('editor:properties.hemisphere.description')}
    >
      <InputGroup name="Sky Color" label={t('editor:properties.hemisphere.lbl-skyColor')}>
        <ColorInput
          value={
            //lightComponent.skyColor
            undefined
          }
          onChange={updateProperty(HemisphereLightComponent, 'skyColor')}
        />
      </InputGroup>
      <InputGroup name="Ground Color" label={t('editor:properties.hemisphere.lbl-groundColor')}>
        <ColorInput
          value={
            //lightComponent.groundColor
            undefined
          }
          onChange={updateProperty(HemisphereLightComponent, 'groundColor')}
        />
      </InputGroup>
      <InputGroup name="Intensity" label={t('editor:properties.hemisphere.lbl-intensity')}>
        <NumericInput
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={
            //lightComponent.intensity
            0
          }
          onChange={updateProperty(HemisphereLightComponent, 'intensity')}
          onRelease={commitProperty(HemisphereLightComponent, 'intensity')}
          unit="cd"
        />
      </InputGroup>
    </NodeEditor>
  )
}

HemisphereLightNodeEditor.iconComponent = VerifiedUserIcon

export default HemisphereLightNodeEditor
