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
namespace Contexter\Adapter;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Router\RouteMatch;

interface AdapterInterface
{

    /**
     * @return array
     */
    public function getProvidedParams();

    /**
     * @return array
     */
    public function getRouteParams();

    /**
     * @return array
     */
    public function getParams();

    /**
     * @return array
     */
    public function getKeys();

    /**
     * @return AbstractActionController
     */
    public function getAdaptee();

    /**
     * @param RouteMatch $routeMatch
     * @return self
     */
    public function setRouteMatch(RouteMatch $routeMatch);

    /**
     * @param mixed $adapter
     * @return self
     */
    public function setAdaptee($adapter);
}
