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
namespace Notification\Form;

use Zend\Form\Element;
use Zend\Form\Fieldset;
use Zend\InputFilter\InputFilterProviderInterface;

class OptInFieldset extends Fieldset implements InputFilterProviderInterface
{
    public function __construct()
    {
        parent::__construct('subscription');

        $subscribe = new Element\Checkbox('subscribe');
        $subscribe->setName('subscribe');
        $subscribe->setLabel('Add to watchlist.');
        $subscribe->setChecked(true);
        $subscribe->setAttribute('class', 'control');


        $mailman = new Element\Checkbox('mailman');
        $mailman->setName('mailman');
        $mailman->setLabel('Receive notifications via email.');
        $mailman->setChecked(true);
        $mailman->setAttribute('class', 'control');

        $this->add($subscribe);
        $this->add($mailman);
    }

    public function getInputFilterSpecification()
    {
        return [
            [
                'name'     => 'subscribe',
                'required' => true,
            ],
            [
                'name'     => 'mailman',
                'required' => true,
            ],
        ];
    }
}
