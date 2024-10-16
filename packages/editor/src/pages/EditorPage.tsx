/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/ir-engine/ir-engine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Infinite Reality Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Infinite Reality Engine team.

All portions of the code written by the Infinite Reality Engine team are Copyright © 2021-2023 
Infinite Reality Engine. All Rights Reserved.
*/

import { PopoverState } from '@ir-engine/client-core/src/common/services/PopoverState'
import '@ir-engine/engine/src/EngineModule'
import { getMutableState, useHookstate, useImmediateEffect } from '@ir-engine/hyperflux'
import { loadEngineInjection } from '@ir-engine/projects/loadEngineInjection'
import { EngineState } from '@ir-engine/spatial/src/EngineState'
import Button from '@ir-engine/ui/src/primitives/tailwind/Button'
import Modal from '@ir-engine/ui/src/primitives/tailwind/Modal'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiInfo } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import '../EditorModule'
import EditorContainer from '../components/EditorContainer'
import { isSupportedBrowser } from '../functions/browserCheck'
import { isSupportedDevice } from '../functions/deviceCheck'
import { EditorState } from '../services/EditorServices'
import { ProjectPage } from './ProjectPage'

const downloadGoogleLink =
  'https://www.google.com/chrome/dr/download/?brand=CBFU&ds_kid=43700079286123654&gad_source=1&gclid=CjwKCAjwooq3BhB3EiwAYqYoEkgLBNGFDuKclZQTGAA8Lzq66cvirjjOm7ur0ayMgKvn9y3Fd1spThoCXu0QAvD_BwE&gclsrc=aw.ds'
export const useStudioEditor = () => {
  const engineReady = useHookstate(false)

  useEffect(() => {
    getMutableState(EngineState).isEditor.set(true)
    getMutableState(EngineState).isEditing.set(true)
    loadEngineInjection().then(() => {
      engineReady.set(true)
    })
  }, [])

  return engineReady.value
}

export const EditorPage = () => {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const { scenePath, projectName, acknowledgedUnsupportedBrowser, acknowledgedUnsupportedDevice } = useHookstate(
    getMutableState(EditorState)
  )
  const supportedBrowser = useHookstate(isSupportedBrowser)
  const supportedDevice = useHookstate(isSupportedDevice)

  useImmediateEffect(() => {
    const sceneInParams = params.get('scenePath')
    if (sceneInParams) scenePath.set(sceneInParams)
    const projectNameInParams = params.get('project')
    if (projectNameInParams) projectName.set(projectNameInParams)
  }, [params])

  useEffect(() => {
    if (!scenePath.value) return

    const parsed = new URL(window.location.href)
    const query = parsed.searchParams

    query.set('scenePath', scenePath.value)

    parsed.search = query.toString()
    if (typeof history.pushState !== 'undefined') {
      window.history.replaceState({}, '', parsed.toString())
    }
  }, [scenePath])

  if (!scenePath.value && !projectName.value) return <ProjectPage studioPath="/studio" />
  return (
    <>
      <EditorContainer />
      {!supportedBrowser.value &&
        !acknowledgedUnsupportedBrowser.value &&
        PopoverState.showPopupover(
          <Modal
            onSubmit={() => {
              return true
            }}
            onClose={() => {
              acknowledgedUnsupportedBrowser.set(true)
              PopoverState.hidePopupover()
            }}
            className="w-[50vw] max-w-2xl"
            hideFooter
          >
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#212226]">
                <FiInfo className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-center gap-3 p-4 px-12 pb-12">
                <span className="text-center font-bold">{t('editor:unsupportedBrowser.title')}</span>
                <span className="text-center">{t('editor:unsupportedBrowser.description')}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={() => window.open(downloadGoogleLink)}>
                  {t('editor:unsupportedBrowser.downloadChrome')}
                </Button>
                <Button>
                  <span
                    onClick={() => {
                      PopoverState.hidePopupover()
                      acknowledgedUnsupportedBrowser.set(true)
                    }}
                  >
                    {t('editor:unsupportedBrowser.continue')}
                  </span>
                </Button>
              </div>
            </div>
          </Modal>
        )}

      {!supportedDevice.value &&
        !acknowledgedUnsupportedDevice.value &&
        PopoverState.showPopupover(
          <Modal
            onSubmit={() => {
              return true
            }}
            onClose={() => {
              acknowledgedUnsupportedDevice.set(true)
              PopoverState.hidePopupover()
            }}
            className="w-[50vw] max-w-2xl"
            hideFooter
          >
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#212226]">
                <FiInfo className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-center gap-3 p-4 px-12 pb-12">
                <span className="text-center font-bold">{t('editor:unsupportedDevice.title')}</span>
                <span className="text-center">{t('editor:unsupportedDevice.description')}</span>
              </div>
              <div className="flex gap-3">
                <Button>
                  <span
                    onClick={() => {
                      PopoverState.hidePopupover()
                      acknowledgedUnsupportedDevice.set(true)
                    }}
                  >
                    {t('editor:unsupportedDevice.continue')}
                  </span>
                </Button>
              </div>
            </div>
          </Modal>
        )}
    </>
  )
}
