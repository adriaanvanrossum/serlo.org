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

namespace FeatureFlags;

use FeatureFlags\Factory\FeatureFlagsHelperFactory;
use FeatureFlags\Factory\ServiceFactory;

return [
    'feature_flags' => [
        'client-frontend' => false,
        'donation-banner' => false,
        'frontend-content' => false,
        'frontend-diff' => false,
        'frontend-donation-banner' => false,
        'frontend-editor' => false,
        'frontend-footer' => false,
        'frontend-legacy-content' => false,
        'key-value-store' => false,
    ],
    'service_manager' => [
        'factories' => [
            Service::class => ServiceFactory::class,
        ],
    ],
    'view_helpers' => [
        'factories' => [
            'featureFlags' => FeatureFlagsHelperFactory::class,
        ],
    ],
];
