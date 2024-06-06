var fsm_examples = {
  "DFA AB": {"type":"DFA","dfa":{"transitions":{"start":{"A":"s0"},"s0":{"B":"s1"},"s1":{"A":"s2"},"s2":{"B":"s1"}},"startState":"start","acceptStates":["s1"]},"states":{"start":{},"s0":{"top":186,"left":208},"s1":{"isAccept":true,"top":296,"left":231},"s2":{"top":372,"left":70}},"transitions":[{"stateA":"start","label":"A","stateB":"s0"},{"stateA":"s0","label":"B","stateB":"s1"},{"stateA":"s1","label":"A","stateB":"s2"},{"stateA":"s2","label":"B","stateB":"s1"}],"bulkTests":{"accept":"AB\nABAB\nABABAB","reject":"\nA\nB\nABA\nBA\nBB\nABABB"}},
  "NFA AB": {"type":"NFA","nfa":{"transitions":{"start":{"A":["s0"]},"s0":{"B":["s1"]},"s1":{"":["start"]}},"startState":"start","acceptStates":["s1"]},"states":{"start":{},"s0":{"top":150,"left":245},"s1":{"isAccept":true,"top":327,"left":224}},"transitions":[{"stateA":"start","label":"A","stateB":"s0"},{"stateA":"s0","label":"B","stateB":"s1"},{"stateA":"s1","label":"ϵ","stateB":"start"}],"bulkTests":{"accept":"AB\nABAB\nABABAB","reject":"\nA\nB\nABA\nBA\nBB\nABABB"}},
};
var fsm_examples = {
  "DFA AB": {
      "type": "DFA",
      "dfa": {
          "transitions": {
              "start": {"A": "s0"},
              "s0": {"B": "s1"},
              "s1": {"A": "s2"},
              "s2": {"B": "s1"}
          },
          "startState": "start",
          "acceptStates": ["s1"]
      },
      "states": {
          "start": {},
          "s0": {"top": 186, "left": 208},
          "s1": {"isAccept": true, "top": 296, "left": 231},
          "s2": {"top": 372, "left": 70}
      },
      "transitions": [
          {"stateA": "start", "label": "A", "stateB": "s0"},
          {"stateA": "s0", "label": "B", "stateB": "s1"},
          {"stateA": "s1", "label": "A", "stateB": "s2"},
          {"stateA": "s2", "label": "B", "stateB": "s1"}
      ],
      "bulkTests": {
          "accept": "AB\nABAB\nABABAB",
          "reject": "\nA\nB\nABA\nBA\nBB\nABABB"
      }
  },
  "NFA AB": {
      "type": "NFA",
      "nfa": {
          "transitions": {
              "start": {"A": ["s0"]},
              "s0": {"B": ["s1"]},
              "s1": { "": ["start"]}
          },
          "startState": "start",
          "acceptStates": ["s1"]
      },
      "states": {
          "start": {},
          "s0": {"top": 150, "left": 245},
          "s1": {"isAccept": true, "top": 327, "left": 224}
      },
      "transitions": [
          {"stateA": "start", "label": "A", "stateB": "s0"},
          {"stateA": "s0", "label": "B", "stateB": "s1"},
          {"stateA": "s1", "label": "ϵ", "stateB": "start"}
      ],
      "bulkTests": {
          "accept": "AB\nABAB\nABABAB",
          "reject": "\nA\nB\nABA\nBA\nBB\nABABB"
      }
  },
  "DFA BAA": {
      "type": "DFA",
      "dfa": {
          "transitions": {
              "start": {"B": "s1"},
              "s1": {"A": "s2", "B": "s1"},
              "s2": {"A": "s3", "B": "s1"},
              "s3": {"A": "s3", "B": "s1"}
          },
          "startState": "start",
          "acceptStates": ["s3"]
      },
      "states": {
          "start": {},
          "s1": {"top": 100, "left": 150},
          "s2": {"top": 200, "left": 250},
          "s3": {"isAccept": true, "top": 300, "left": 350}
      },
      "transitions": [
          {"stateA": "start", "label": "B", "stateB": "s1"},
          {"stateA": "s1", "label": "A", "stateB": "s2"},
          {"stateA": "s2", "label": "A", "stateB": "s3"},
          {"stateA": "s3", "label": "A", "stateB": "s3"},
          {"stateA": "s1", "label": "B", "stateB": "s1"},
          {"stateA": "s2", "label": "B", "stateB": "s1"},
          {"stateA": "s3", "label": "B", "stateB": "s1"}
      ],
      "bulkTests": {
          "accept": "BAA\nBBAA\nBAAAA\nBBAAAAA\nABBAA",
          "reject": "\nA\nB\nBA\nAB\nBB\nBAAB\nBBA\nBAAB"
      }
  },
  "NFA End AB": {
      "type": "NFA",
      "nfa": {
          "transitions": {
              "start": {"A": ["start", "s1"], "B": ["start"]},
              "s1": {"B": ["s2"]}
          },
          "startState": "start",
          "acceptStates": ["s2"]
      },
      "states": {
          "start": {},
          "s1": {"top": 150, "left": 245},
          "s2": {"isAccept": true, "top": 327, "left": 224}
      },
      "transitions": [
          {"stateA": "start", "label": "A", "stateB": "start"},
          {"stateA": "start", "label": "B", "stateB": "start"},
          {"stateA": "start", "label": "A", "stateB": "s1"},
          {"stateA": "s1", "label": "B", "stateB": "s2"}
      ],
      "bulkTests": {
          "accept": "AB\nAAB\nBAAB\nABAB\nBAAB",
          "reject": "\nA\nB\nBA\nAA\nBB\nAABA\nABA"
      }
  }
  
};

