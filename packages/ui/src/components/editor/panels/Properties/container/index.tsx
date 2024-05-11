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

import { useHookstate } from '@hookstate/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { UUIDComponent } from '@etherealengine/ecs'
import { useAllComponents, useOptionalComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { getMutableState, getState } from '@etherealengine/hyperflux'

import { EntityUUID } from '@etherealengine/ecs'
import { ComponentEditorsState } from '@etherealengine/editor/src/functions/ComponentEditors'
import { EditorState } from '@etherealengine/editor/src/services/EditorServices'
import { SelectionState } from '@etherealengine/editor/src/services/SelectionServices'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import Popover from '../../../../../primitives/mui/Popover'
import Button from '../../../../../primitives/tailwind/Button'
import { PopoverContext } from '../../../util/PopoverContext'

const EntityComponentEditor = (props: { entity; component; multiEdit }) => {
  const { entity, component, multiEdit } = props
  const componentMounted = useOptionalComponent(entity, component)
  const Editor = getState(ComponentEditorsState)[component.name]!
  if (!componentMounted) return null
  // nodeEntity is used as key here to signal to React when the entity has changed,
  // and to prevent state from being recycled between editor instances, which
  // can cause hookstate to throw errors.
  return <Editor key={`${entity}-${Editor.name}`} multiEdit={multiEdit} entity={entity} component={component} />
}

const EntityEditor = (props: { entityUUID: EntityUUID; multiEdit: boolean }) => {
  const { entityUUID, multiEdit } = props
  const anchorEl = useHookstate<HTMLButtonElement | null>(null)
  const { t } = useTranslation()

  const entity = UUIDComponent.getEntityByUUID(entityUUID)

  useHookstate(getMutableState(ComponentEditorsState).keys).value
  const components = useAllComponents(entity).filter((c) => !!getState(ComponentEditorsState)[c.name])

  const open = !!anchorEl.value

  return (
    <PopoverContext.Provider
      value={{
        handlePopoverClose: () => {
          anchorEl.set(null)
        }
      }}
    >
      <div className="ml-auto flex h-8 bg-zinc-900">
        <Button
          startIcon={<HiOutlinePlusCircle />}
          variant="transparent"
          rounded="none"
          className="bg-theme-highlight ml-auto w-32 px-2"
          size="small"
          onClick={(event) => anchorEl.set(event.currentTarget)}
        >
          {t('editor:properties.lbl-addComponent')}
        </Button>
      </div>
      <Popover
        id={open ? 'add-component-popover' : undefined}
        open={open}
        anchorEl={anchorEl.value}
        onClose={() => anchorEl.set(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
      >
        {/*<ElementList />*/}
      </Popover>
      {/*<CoreNodeEditor entity={entity} key={entityUUID + entity} />*/}
      {components.map((c, i) => (
        <EntityComponentEditor
          key={`${entityUUID + entity}-${c.name}`}
          multiEdit={multiEdit}
          entity={entity}
          component={c}
        />
      ))}
    </PopoverContext.Provider>
  )
}

/**
 * PropertiesPanelContainer used to render editor view to customize property of selected element.
 */
export const PropertiesPanelContainer = () => {
  const selectedEntities = useHookstate(getMutableState(SelectionState).selectedEntities).value
  const lockedNode = useHookstate(getMutableState(EditorState).lockPropertiesPanel)
  const multiEdit = selectedEntities.length > 1
  const uuid = lockedNode.value ? lockedNode.value : selectedEntities[selectedEntities.length - 1]
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto rounded-[5px] bg-neutral-900 px-1">
      {uuid ? (
        <EntityEditor entityUUID={uuid} key={uuid} multiEdit={multiEdit} />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          {t('editor:properties.noNodeSelected')}
        </div>
      )}
    </div>
  )
}

export default PropertiesPanelContainer
