define([
    './consoleColor',
    './writeMode'
],function() {
    'use strict';
    var RenderOptions = function(renderOptions){
        
        renderOptions = renderOptions || {};

        this.DefaultColor = renderOptions.defaultColor || ConsoleColor.White;
        
        this.PromptColor = renderOptions.promptColor || ConsoleColor.Yellow;

        this.SubnoteColor = renderOptions.subnoteColor || ConsoleColor.Gray;

        this.InvalidColor = renderOptions.invalidColor || ConsoleColor.Red;

        this.OptionColor = renderOptions.optionColor || ConsoleColor.DarkYellow;

        this.RoutineInputColor = renderOptions.routineInputColor || ConsoleColor.Cyan;

        renderOptions.blacklistColors = renderOptions.blacklistColors || [];
        this.BlacklistColors = renderOptions.blacklistColors;

        this.WriteMode = renderOptions.writeMode || WriteMode.WriteAll;

        this.DefaultGoBackMessage = renderOptions.defaultGoBackMessage || '<==\tGo Back';

        this.ContinueMessage = renderOptions.continueMessage || 'Press enter to continue...';

    };

    RenderOptions.prototype.GetColor = function(color){
        return color || this.DefaultColor;
    };

    return RenderOptions;
});