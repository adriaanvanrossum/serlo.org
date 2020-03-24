<?php
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

namespace Alias\Controller;

use Alias\Exception\AliasNotFoundException;
use Alias;
use DateTime;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class ApiController extends AbstractActionController
{
    use Alias\AliasManagerAwareTrait;
    use \Entity\Manager\EntityManagerAwareTrait;
    use \Instance\Manager\InstanceManagerAwareTrait;
    use \Page\Manager\PageManagerAwareTrait;

    public function indexAction()
    {
        $alias = $this->params('alias');
        $instance = $this->getInstanceManager()->getInstanceFromRequest();

        try {
            $source = $this->aliasManager->findSourceByAlias($alias, $instance, true);
            if (preg_match('/\/page\/view\/(\d+)/', $source, $matches)) {
                $id = (int)$matches[1];
                $page = $this->getPageManager()->getPageRepository($id);

                return new JsonModel([
                    'id' => (int)$matches[1],
                    'trashed' => $page->getTrashed(),
                    'discriminator' => 'page',
                    'currentRevisionId' => $page->getCurrentRevision()->getId(),
                ]);
            }

            if (preg_match('/\/entity\/view\/(\d+)/', $source, $matches)) {
                $id = (int)$matches[1];
                $entity = $this->getEntityManager()->getEntity($id);
                return new JsonModel([
                    'id' => (int)$matches[1],
                    'trashed' => $entity->getTrashed(),
                    'discriminator' => 'entity',
                    'type' => $entity->getType()->getName(),
                    'instance' => $entity->getInstance()->getSubdomain(),
                    'date' => $entity->getTimestamp()->format(DateTime::ATOM),
                    'currentRevisionId' => $entity->getCurrentRevision()->getId(),
                    'licenseId' => $entity->getLicense()->getId(),
                ]);
            }

            return new JsonModel(['location' => $source, 'alias' => $alias]);
        } catch (AliasNotFoundException $e) {
            $this->getResponse()->setStatusCode(404);
            return false;
        }
    }
}
