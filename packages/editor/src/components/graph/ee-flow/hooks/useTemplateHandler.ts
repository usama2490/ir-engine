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
import { Edge, Node } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { BehaveGraphState } from '@etherealengine/engine/src/behave-graph/state/BehaveGraphState'
import { GraphTemplate } from '@etherealengine/engine/src/behave-graph/types/GraphTemplate'
import { NO_PROXY, getMutableState } from '@etherealengine/hyperflux'
import { useHookstate } from '@hookstate/core'
import { uniqueId } from 'lodash'
import { useSelectionHandler } from './useSelectionHandler'

type selectionHandler = ReturnType<typeof useSelectionHandler>

export const useTemplateHandler = ({
  selectedNodes,
  selectedEdges,
  pasteNodes
}: Pick<selectionHandler, 'pasteNodes'> & {
  selectedNodes: Node[]
  selectedEdges: Edge[]
}) => {
  const behaveGraphState = useHookstate(getMutableState(BehaveGraphState))

  const handleAddTemplate = () => {
    const newTemplate = {
      id: uuidv4(),
      name: uniqueId('New template '),
      nodes: selectedNodes,
      edges: selectedEdges
    } as GraphTemplate
    behaveGraphState.templates.set([...behaveGraphState.templates.get(NO_PROXY), newTemplate])
  }

  const handleEditTemplate = (editedTemplate) => {
    const filterList = behaveGraphState.templates.get(NO_PROXY).filter((template) => template.id !== editedTemplate.id)
    behaveGraphState.templates.set([...filterList, editedTemplate])
  }

  const handleDeleteTemplate = (deleteTemplate) => {
    behaveGraphState.templates.set(
      behaveGraphState.templates.get(NO_PROXY).filter((template) => template.id !== deleteTemplate.id)
    )
  }

  const handleApplyTemplate = (template) => {
    pasteNodes(template.nodes, template.edges)
  }

  return { handleAddTemplate, handleEditTemplate, handleDeleteTemplate, handleApplyTemplate }
}
