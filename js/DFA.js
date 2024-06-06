function DFA(useDefaults) {
  "use strict";
  this.transitions = {};
  this.startState = useDefaults ? 'start' : null;
  this.acceptStates = useDefaults ? ['accept'] : [];

  this.processor = {
    input: null,
    inputLength: 0,
    state: null,
    inputIndex: 0,
    status: null,
  };
}

$(function() {
  "use strict";

  DFA.prototype.transition = function(state, character) {
    var retVal = (this.transitions[state]) ? this.transitions[state][character] : null;
    return !retVal ? null : retVal;
  };

  DFA.prototype.deserialize = function(json) {
    this.transitions = json.transitions;
    this.startState = json.startState;
    this.acceptStates = json.acceptStates;
    return this;
  };

  DFA.prototype.serialize = function() {
    return {transitions:this.transitions, startState:this.startState, acceptStates:this.acceptStates};
  };

  DFA.prototype.loadFromString = function(JSONdescription) {
    var parsedJSON = JSON.parse(JSONdescription);
    return this.deserialize(parsedJSON);
  };

  DFA.prototype.saveToString = function() {
    return JSON.stringify(this.serialize());
  };

  DFA.prototype.addTransition = function(stateA, character, stateB) {
    if (!this.transitions[stateA]) {this.transitions[stateA] = {};}
    this.transitions[stateA][character] = stateB;
    return this;
  };

  DFA.prototype.hasTransition = function(state, character) {
    if (this.transitions[state]) {return !!this.transitions[state][character];}
    return false;
  };

  DFA.prototype.removeTransitions = function(state) {
    delete this.transitions[state];
    var self = this;
    $.each(self.transitions, function(stateA, sTrans) {
      $.each(sTrans, function(char, stateB) {
        if (stateB === state) {self.removeTransition(stateA, char);}
      });
    });
    return this;
  };

  DFA.prototype.removeTransition = function(stateA, character) {
    if (this.transitions[stateA]) {delete this.transitions[stateA][character];}
    return this;
  };

  DFA.prototype.setStartState = function(state) {
    this.startState = state;
    return this;
  };

  DFA.prototype.addAcceptState = function(state) {
    this.acceptStates.push(state);
    return this;
  };

  DFA.prototype.removeAcceptState = function(state) {
    var stateI = -1;
    if ((stateI = this.acceptStates.indexOf(state)) >= 0) {
      this.acceptStates.splice(stateI, 1);
    }
    return this;
  };

  DFA.prototype.accepts = function(input) {
    var _status = this.stepInit(input);
    while (_status === 'Active') {_status = this.step();}
    return _status === 'Accept';
  };

  DFA.prototype.status = function() {
    return {
      state: this.processor.state,
      input: this.processor.input,
      inputIndex: this.processor.inputIndex,
      nextChar: this.processor.input.substr(this.processor.inputIndex, 1),
      status: this.processor.status
    };
  };

  DFA.prototype.stepInit = function(input) {
    this.processor.input = input;
    this.processor.inputLength = this.processor.input.length;
    this.processor.inputIndex = 0;
    this.processor.state = this.startState;
    this.processor.status = (this.processor.inputLength === 0 && this.acceptStates.indexOf(this.processor.state) >= 0) ? 'Accept' : 'Active';
    this.updateVisualization();
    return this.processor.status;
  };

  DFA.prototype.step = function() {
    if ((this.processor.state = this.transition(this.processor.state, this.processor.input.substr(this.processor.inputIndex++, 1))) === null) {this.processor.status = 'Reject';}
    if (this.processor.inputIndex === this.processor.inputLength) {this.processor.status = (this.acceptStates.indexOf(this.processor.state) >= 0 ? 'Accept' : 'Reject');}
    this.updateVisualization();
    return this.processor.status;
  };

  DFA.prototype.updateVisualization = function() {
    var self = this;
    $('#dfa-container').empty();
    $.each(this.transitions, function(state, trans) {
      var stateDiv = $('<div>').addClass('state').attr('id', state).text(state);
      if (self.processor.state === state) {
        stateDiv.addClass('active');
      }
      if (self.acceptStates.indexOf(state) >= 0) {
        stateDiv.addClass('accept');
      }
      if (self.states && self.states[state]) {
        stateDiv.css({ top: self.states[state].top, left: self.states[state].left });
      }
      $('#dfa-container').append(stateDiv);
    });
  };

  DFA.runTests = function() {
    function assert(outcome, description) {window.console && console.log((outcome ? 'Pass:' : 'FAIL:'), description);}

    var myDFA = new DFA(true)
      .addTransition('start', 'a', 's1')
      .addTransition('s1', 'a', 's2')
      .addTransition('s1', 'c', 'end2')
      .addTransition('s2', 'b', 'accept')
      .addAcceptState('end2');

    assert(myDFA.accepts('aab'), 'Accept aab');
    assert(myDFA.accepts('ac'), 'Accept ac');
    assert(!myDFA.accepts(''), 'Reject [emptyString]');
    assert(!myDFA.accepts('a'), 'Reject a');
    assert(!myDFA.accepts('aa'), 'Reject aa');
    assert(!myDFA.accepts('ab'), 'Reject ab');

    console.log('Remove transition');
    myDFA.removeTransition('s1', 'c');
    assert(!myDFA.accepts('ac'), 'Reject ac');

    console.log('Change start state');
    myDFA.setStartState('s1');
    assert(myDFA.accepts('ab'), 'Accept ab');
    assert(!myDFA.accepts('aab'), 'Reject aab');

    console.log('Remove accept state');
    myDFA.removeAcceptState('accept');
    assert(!myDFA.accepts('ab'), 'Reject ab');

    var myDFA_asString = myDFA.saveToString();
    var otherDFA = new DFA().loadFromString(myDFA_asString);
    assert(myDFA_asString === otherDFA.saveToString(), 'Save, Load, Save has no changes');
    assert(!otherDFA.accepts('ab'), 'Loaded DFA rejects ab');
    assert(!otherDFA.accepts(''), 'Loaded DFA rejects [empty string]');
    assert(!otherDFA.accepts('a'), 'Loaded DFA rejects a');

    myDFA = new DFA(true)
      .addTransition('start', 'a', 's1')
      .addTransition('s1', 'b', 's2')
      .addTransition('s2', 'c', 'start')
      .addTransition('s1', 'd', 'accept');
    assert(myDFA.accepts('ad'), 'Accept ad');
    console.log('Remove transitions to/from s1');
    myDFA.removeTransitions('s1');
    assert(!myDFA.accepts('ad'), 'Reject ad');
    myDFA.addTransition('s1', 'e', 'accept');
    // s1 should be gone, so we shouldn't be able to pass through it
    // This test is to check if it really got removed from all inbound transitions
    assert(!myDFA.accepts('ae'), 'Reject ae');
  };

  var fsm_examples = {
    "DFA AB": {"type":"DFA","dfa":{"transitions":{"start":{"A":"s0"},"s0":{"B":"s1"},"s1":{"A":"s2"},"s2":{"B":"s1"}},"startState":"start","acceptStates":["s1"]},"states":{"start":{},"s0":{"top":186,"left":208},"s1":{"isAccept":true,"top":296,"left":231},"s2":{"top":372,"left":70}},"transitions":[{"stateA":"start","label":"A","stateB":"s0"},{"stateA":"s0","label":"B","stateB":"s1"},{"stateA":"s1","label":"A","stateB":"s2"},{"stateA":"s2","label":"B","stateB":"s1"}],"bulkTests":{"accept":"AB\nABAB\nABABAB","reject":"\nA\nB\nABA\nBA\nBB\nABABB"}},
    "NFA AB": {"type":"NFA","nfa":{"transitions":{"start":{"A":["s0"]},"s0":{"B":["s1"]},"s1":{"":["start"]}},"startState":"start","acceptStates":["s1"]},"states":{"start":{},"s0":{"top":150,"left":245},"s1":{"isAccept":true,"top":327,"left":224}},"transitions":[{"stateA":"start","label":"A","stateB":"s0"},{"stateA":"s0","label":"B","stateB":"s1"},{"stateA":"s1","label":"ϵ","stateB":"start"}],"bulkTests":{"accept":"AB\nABAB\nABABAB","reject":"\nA\nB\nABA\nBA\nBB\nABABB"}},
  };

  $('#fsm-select').change(function() {
    var selectedFSM = fsm_examples[$(this).val()];
    if (selectedFSM.type === 'DFA') {
      window.dfa = new DFA().deserialize(selectedFSM.dfa);
      window.dfa.states = selectedFSM.states;
    }
    // Assuming NFA class exists and has similar interface
    else if (selectedFSM.type === 'NFA') {
      window.dfa = new NFA().deserialize(selectedFSM.nfa);
      window.dfa.states = selectedFSM.states;
    }
    window.dfa.updateVisualization();
  }).change(); // Trigger change event to load the initial FSM

  $('#start-debug').click(function() {
    var inputString = $('#input-string').val();
    window.dfa.stepInit(inputString);
  });

  $('#step-debug').click(function() {
    window.dfa.step();
  });

  DFA.runTests = function() {
    function assert(outcome, description) {
      window.console && console.log((outcome ? 'Pass:' : 'FAIL:'), description);
    }
  
    // Define DFA BAA
    var myDFA = new DFA(true)
      .addTransition('start', 'B', 's1')
      .addTransition('s1', 'A', 's2')
      .addTransition('s2', 'A', 's3')
      .addTransition('s3', 'A', 's3')
      .addTransition('s1', 'B', 's1')
      .addTransition('s2', 'B', 's1')
      .addTransition('s3', 'B', 's1')
      .addAcceptState('s3');
  
    // Accept tests
    assert(myDFA.accepts('BAA'), 'Accept BAA');
    assert(myDFA.accepts('BBAA'), 'Accept BBAA');
    assert(myDFA.accepts('BAAAA'), 'Accept BAAAA');
    assert(myDFA.accepts('BBAAAAA'), 'Accept BBAAAAA');
    assert(myDFA.accepts('ABBAA'), 'Accept ABBAA');
  
    // Reject tests
    assert(!myDFA.accepts(''), 'Reject [emptyString]');
    assert(!myDFA.accepts('A'), 'Reject A');
    assert(!myDFA.accepts('B'), 'Reject B');
    assert(!myDFA.accepts('BA'), 'Reject BA');
    assert(!myDFA.accepts('AB'), 'Reject AB');
    assert(!myDFA.accepts('BB'), 'Reject BB');
    assert(!myDFA.accepts('BAAB'), 'Reject BAAB');
    assert(!myDFA.accepts('BBA'), 'Reject BBA');
    assert(!myDFA.accepts('BAAB'), 'Reject BAAB');
  
    // Additional tests for DFA functionality
    console.log('Change start state');
    myDFA.setStartState('s1');
    assert(!myDFA.accepts('BAA'), 'Reject BAA (new start state s1)');
    assert(myDFA.accepts('AA'), 'Accept AA (new start state s1)');
  
    console.log('Remove accept state');
    myDFA.removeAcceptState('s3');
    assert(!myDFA.accepts('BAA'), 'Reject BAA after removing accept state s3');
    
    console.log('Add new accept state');
    myDFA.addAcceptState('s2');
    assert(myDFA.accepts('BA'), 'Accept BA (new accept state s2)');
  
    var myDFA_asString = myDFA.saveToString();
    var otherDFA = new DFA().loadFromString(myDFA_asString);
    assert(myDFA_asString === otherDFA.saveToString(), 'Save, Load, Save has no changes');
    assert(!otherDFA.accepts('BAA'), 'Loaded DFA rejects BAA');
    assert(otherDFA.accepts('BA'), 'Loaded DFA accepts BA');
    assert(!otherDFA.accepts('A'), 'Loaded DFA rejects A');
  };
  
  DFA.runTests();
  
});

