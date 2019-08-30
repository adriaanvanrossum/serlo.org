/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import * as React from 'react'
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import {
  entity,
  Controls,
  editorContent,
  HeaderInput
} from '../entities/common'
import { Settings } from './helpers/settings'

export const coursePageTypeState = StateType.object({
  ...entity,
  icon: StateType.string('explanation'),
  title: StateType.string(''),
  content: editorContent()
})

export const coursePageTypePlugin: StatefulPlugin<
  typeof coursePageTypeState
> = {
  Component: CoursePageTypeEditor,
  state: coursePageTypeState
}

function CoursePageTypeEditor(
  props: StatefulPluginEditorProps<typeof coursePageTypeState> & {
    skipControls?: boolean
  }
) {
  const { title, icon, content } = props.state

  return (
    <article>
      <Settings>
        <Settings.Select
          label="Icon"
          state={icon}
          options={[
            {
              label: 'Erklärung',
              value: 'explanation'
            },
            {
              label: 'Video',
              value: 'play'
            },
            {
              label: 'Aufgabe',
              value: 'question'
            }
          ]}
        />
      </Settings>
      <h1>
        {props.editable ? (
          <HeaderInput
            placeholder="Titel"
            value={title.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              title.set(e.target.value)
            }}
          />
        ) : (
          <span itemProp="name">{title.value}</span>
        )}
      </h1>
      {content.render()}
      {props.skipControls ? null : <Controls subscriptions {...props.state} />}
    </article>
  )
}