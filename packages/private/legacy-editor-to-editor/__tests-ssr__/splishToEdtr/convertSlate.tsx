/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import * as React from 'react'
import { htmlToSlate } from '../../src/splishToEdtr/convertSlate'

describe('slate serializer and deserializer work', () => {
  it('can handle empty paragraphs', () => {
    const html = '<p></p>'

    expect(htmlToSlate(html)).toEqual(
      JSON.parse(
        '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[]}]}}'
      )
    )
  })
  it('works with normal text.', () => {
    const html = 'This was created with'

    expect(htmlToSlate(html)).toEqual(
      JSON.parse(
        '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","data":{},"type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with"}]}]}]}}'
      )
    )
  })

  it('works with normal paragraphs and marks.', () => {
    const html = '<p>This was created with <strong>Splish</strong> editor.</p>'
    expect(htmlToSlate(html)).toEqual(
      JSON.parse(
        '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with "}]},{"object":"text","leaves":[{"object":"leaf","text":"Splish","marks":[{"type":"@splish-me/strong"}]}]},{"object":"text","leaves":[{"object":"leaf","text":" editor."}]}]}]}}'
      )
    )
  })

  it('works with list', () => {
    const html = '<ul><li><p>foo</p></li><li><p>bar</p></li></ul>'
    expect(htmlToSlate(html)).toEqual(
      JSON.parse(
        '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"unordered-list","nodes":[{"object":"block","type":"list-item","nodes":[{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"foo"}]}]}]}]},{"object":"block","type":"list-item","nodes":[{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"bar"}]}]}]}]}]}]}}'
      )
    )
  })

  it('works with real html from splish slate', () => {
    const html =
      '<p>This was created with <strong>Splish</strong> editor.</p><ul><li><p>foo</p></li><li><p>bar</p></li></ul>'
    expect(htmlToSlate(html)).toEqual(
      JSON.parse(
        '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with "}]},{"object":"text","leaves":[{"object":"leaf","text":"Splish","marks":[{"type":"@splish-me/strong"}]}]},{"object":"text","leaves":[{"object":"leaf","text":" editor."}]}]},{"object":"block","type":"unordered-list","nodes":[{"object":"block","type":"list-item","nodes":[{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"foo"}]}]}]}]},{"object":"block","type":"list-item","nodes":[{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"bar"}]}]}]}]}]}]}}'
      )
    )
  })
})
