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
import { uploadFolder } from '@serlo/gcloud'
import * as path from 'path'
import { Signale } from 'signale'
import * as util from 'util'
import * as fs from 'fs'
import { publishPackage, shouldDeployPackage } from '@serlo/cloudflare'

const root = path.join(__dirname, '..')
const sourcePath = path.join(__dirname, '..', 'src')

const gcloudStorageOptions = {
  bucket: 'packages.serlo.org'
}

const packageJsonPath = path.join(root, 'package.json')

const fsOptions = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

const signale = new Signale({ interactive: true })

run().then(() => {})

async function run() {
  try {
    signale.info('Deploying static assets')

    const { version } = await fetchPackageJSON()

    const shouldDeploy = await shouldDeployPackage({
      name: 'static-assets',
      version
    })
    if (!shouldDeploy) {
      signale.success('Skipping deployment')
      return
    }

    signale.pending(`Uploading static assets…`)
    upload(version)

    signale.pending(`Publishing package…`)
    await publish(version)

    signale.success(`Successfully deployed static assets`)
  } catch (e) {
    signale.fatal(e)
  }
}

function fetchPackageJSON(): Promise<{ version: string }> {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse)
}

function upload(version: string) {
  uploadFolder({
    bucket: gcloudStorageOptions.bucket,
    source: sourcePath,
    target: `static-assets@${version}`
  })
}

async function publish(version: string) {
  await publishPackage({
    name: 'static-assets',
    version
  })
}
