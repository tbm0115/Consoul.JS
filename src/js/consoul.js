define([
    './renderOptions',
    './consoleColor',
    './writeMode'
], function() {
    'use strict';
    var Consoul = function(element, renderOptions) {
        this.Element = element;

        this.Id = ''; // TODO: create GUID

        renderOptions = renderOptions || {};

        this.RenderOptions = new RenderOptions(renderOptions);

    }
    /**
     * Internal Console.WriteLine() wrapper
     * @access private
     * @param {string} message Display message
     * @param {string} color Color for Message
     * @param {boolean?} writeLine Specifies whether to use Console.WriteLine() or Console.Write().
     */
    Consoul.prototype._write = function(message, color, writeLine){
        writeLine = writeLine || false;
        var elementType = writeLine ? 'p' : 'span';
        var element = document.createElement(elementType);
        this.Element.appendChild(element);
        element.textContent = message;
        element.style.color = color;
    };

    /**
     * Writes a message to the Console. Rendering depends on RenderOptions.WriteMode
     * @access public
     * @param {string} message Display message
     * @param {string} color Color for Message. Defaults to RenderOptions.DefaultColor
     * @param {boolean?} writeLine Specifies whether to use Console.WriteLine() or Console.Write()
     */
    Consoul.prototype.Write = function(message, color, writeLine){
        color = color || this.RenderOptions.GetColor(color);
        switch(this.RenderOptions.WriteMode){
            case WriteMode.SuppressAll:
                // Do nothing
                break;
            case WriteMode.SuppressBlacklist:
                if (!this.RenderOptions.BlacklistColors.Contains(color)){
                    this._write(message, color, writeLine);
                }
                break;
            default: // Include WriteAll
                this._write(message, color, writeLine);
                break;
        }
    };

    /**
     * Waits for user response
     * @access public
     * @returns {string} User Response
     */
    Consoul.prototype.Read = function(callback){
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        this.Element.appendChild(input);
        var fncInput = function(){
            callback(input.value);
        }
        input.addEventListener('blur', fncInput);
        input.addEventListener('input', fncInput);
    };

    /**
     * Prompts the user to acknowledge a Prompt.
     * @access public
     * @param {string} message Display message
     * @param {boolean} clear Option to clear the Console buffer. If true, can make the prompt more prominant.
     * @param {boolean} allowEmpty Specifies whether the user can provide an empty response. Default is typically the 'No', but can be overriden
     * @param {boolean} defaultIsNo Specifies whether the default entry should be 'No'. This only applies if 'allowEmpty' is true.
     */
    Consoul.prototype.Ask = function(message, callback, options){// clear, allowEmpty, defaultIsNo){
        options = options || {};
        clear = options.clear || false;
        allowEmpty = options.allowEmpty || false;
        defaultIsNo = options.defaultIsNo || true;
        
        var orEmpty = ' or Press Enter';
        var options = [
            'Y' + (allowEmpty && !defaultIsNo ? orEmpty : '') + '=Yes',
            'N' + (allowEmpty && defaultIsNo ? orEmpty : '') + '=No'
        ];
        var optionMessage = '(' + options.join(', ') + ')';

        var fncPrompt = (function(){
            if (clear){
                this.Element.innerHTML = '';
            }
            this._write(message, this.RenderOptions.PromptColor);
            this._write(optionMessage, this.RenderOptions.SubnoteColor);

            this.Read(function(value){
                if (value.toLowerCase() != 'y' && value.toLowerCase() != 'n' && value != ''){
                    this.Write('Invalid input', this.RenderOptions.InvalidColor);
                    fncPrompt();
                    return;
                }
                if (allowEmpty && value == ''){
                    value = defaultIsNo ? 'n' : 'y';
                }
                callback(value.toLowerCase() == 'y');
            });
        })();
    };

    /**
     * Prompts the user for free response
     * @access public
     * @param {string} message
     * @param {boolean} clear
     * @param {string[]} options
     * @returns {int} Index of chosen options.
     */
    Consoul.prototype.Prompt = function(message, clear, options){
        throw Error('Not implemented');
    };

    return Consoul;
});
var consoul = new Consoul();