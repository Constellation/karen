/**
 * @license MIT License
 *
 * Copyright (c) 2015 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 * Copyright (c) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import MessageActionCreator from '../../intent/action/MessageActionCreator';
import Mousetrap from 'mousetrap';
import Rx from 'rx';
import UIActionCreator from '../../intent/action/UIActionCreator';

export default class InputBoxViewController {

    /**
     *  @constructor
     *  @param  {DomainState}   domain
     *  @param  {Element}   element
     */
    constructor(domain, element) {
        if (!element) {
            throw new Error();
        }

        /** @type   {Element}   */
        this._element = element;

        /** @type   {DomainState}   */
        this._domain = domain;

        /** @type   {Element}   */
        this._textInput = element.querySelector('#input');

        /*eslint-disable valid-jsdoc */
        /** @type   {Rx.IDisposable}    */
        this._disposeFocus = UIActionCreator.getDispatcher().focusInputBox.subscribe(() => {
            this.focusInput();
        });
        /*eslint-enable*/

        this._init();
    }

    _init() {
        this._element.addEventListener('submit', this);

        const shortcut = [
            'command+k',
            'ctrl+l',
            'ctrl+shift+l'
        ];
        new Mousetrap(this._textInput).bind(shortcut, (aEvent) => {
            if (aEvent.target === this._textInput) {
                MessageActionCreator.clear();
            }
        });
    }

    /**
     *  @return {Element}
     */
    get textInput() {
        return this._textInput;
    }

    /**
     *  @param  {Event} aEvent
     *  @return {void}
     */
    handleEvent(aEvent) {
        switch (aEvent.type) {
            case 'submit':
                this.onSubmit(aEvent);
                break;
        }
    }

    /**
     *  @param  {Event} aEvent
     *  @return {void}
     */
    onSubmit(aEvent) {
        aEvent.preventDefault();

        const input = this._textInput;
        const text = input.value;
        const channelId = this._domain.currentTab.channelId;
        const id = channelId.expect('the input box cannot submitted if any channel is not selected');

        // lock input field until dispatching to input command.
        input.readOnly = true;
        MessageActionCreator.inputCommand(id, text);
        input.value = '';
        input.readOnly = false;
    }

    /**
     *  @return {void}
     */
    focusInput() {
        this._textInput.focus();
    }
}
