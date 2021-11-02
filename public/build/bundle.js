
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    var questions = [
      {
        text: 'Baby has fallen asleep peacefully and easily in your arms. There\'s a match on TV just about to start. Do you hold the baby while you watch the match, put the baby in a moses basket in the room, or give the baby to your partner to look after?',
        options: [
          {
            buttonText: 'Hold Baby',
            failureMessage: 'You can\'t hide your primal scream of joy as Joelinton scores. The baby wakes up with a start and, seeing the frozen mix of joy and horror on your face as you realise the gravity of the situation and all of the life choices that have led you to this moment, contorts its face and cries out in existential crisis.',
            successMessage: 'The game is a predictable snoozefest. Aren\'t games involving your team always? Baby slumbers peacefully and you hate yourself for not making more of the time. This is winning.',
          },
          {
            buttonText: 'Moses Basket',
            failureMessage: 'As you manoeuvre baby over the airspace of the Moses basket, its dreams shift uneasily to being dangled over a 4,000m sheer cliff. It jerks awake in horror and, as you almost drop it and a startled word escapes the Profanisaurus in your brain, baby scrunches up its face and cries.',
            successMessage: 'Michael Owen is commentating. You almost fall asleep yourself placing baby in the Moses basket. Baby dreams about a far distant ancestor explaining how that would have been a goal if it went in. This is winning.',
          },
          {
            buttonText: 'Give to Partner',
            failureMessage: 'Baby dreams it is being abandoned by its daddy. Waking from this dream and finding itself halfway out of your arms, it realises its nightmare has come true and cries in infinite betrayal.',
            successMessage: 'Baby cuddles into partner\'s safe, warm embrace and snuggles down for a long nap. Partner silently hates you. This is winning.',
          }
        ]
      },
      {
        text: 'Baby has just finished a big bottle of milk. It\'s looking pretty content. Do you try to burp baby, play with baby or gaze lovingly into baby\'s eyes?',
        options: [
          {
            buttonText: 'Burp Baby',
            failureMessage: 'Baby was so proud at having taken a full bottle without swallowing any air! But what\'s this? Dad didn\'t trust me?! Baby, sensing daddy will never trust it to do anything right, wails in despair.',
            successMessage: 'Baby pulls its head back before launching it forward, spraying a copious wave of milky sick in your face. Baby giggles. This is winning.',
          },
          {
            buttonText: 'Play',
            failureMessage: 'You go to play with baby before remembering that you have no idea how to actually entertain a baby. After 4 seconds of waiting, baby loses patience and starts screaming.',
            successMessage: 'While trying to remember all your dad training, your face contorts into such an odd picture of concentration and consternation that baby laughs at it. This is winning.',
          },
          {
            buttonText: 'Gaze Into Eyes',
            failureMessage: 'You gaze lovingly in stunned awe at this wonderful creature you created. It hates you and cries.',
            successMessage: 'You gaze lovingly in stunned awe at this wonderful creature you created. Baby gazes back, confused. You start to wonder with mild paranoia if baby is judging you for having feelings. At least it\'s not crying. This is winning.',
          }
        ]
      }
    ];

    var constants = {
      feelings: ['- Pick one -', 'Awful', 'Could be better', 'Ok', 'Pretty good thanks', 'Amazing'],
      gameStates: {
        main: 'main',
        inGame: 'inGame',
        prestart: 'prestart',
        setup: 'setup'
      },
      pronouns: [
        'Female',
        'Male',
        'Neutral'
      ],
      questions,
      randomNumber: () => Math.floor(Math.random() * 100)
    };

    const name$1 = writable('Bort');
    const socialHandle$1 = writable('borty69');

    var details = {
      name: name$1,
      socialHandle: socialHandle$1
    };

    const chance = writable(constants.randomNumber());
    const feeling = writable('');
    const gameState = writable(constants.gameStates.prestart);
    const name = details.name;
    const socialHandle = details.socialHandle;
    writable(constants.pronouns.neutral);

    derived(
    	name,
    	$name => `Hi ${$name}, I'm dad!`
    );

    derived(
      feeling,
      $feeling => `Hi ${$feeling.toLocaleLowerCase()}, I'm dad!`
    );

    /* src/Main.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/Main.svelte";

    function create_fragment$4(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(/*$name*/ ctx[0]);
    			t1 = text(" has had an unfortunate Svelting accident.");
    			t2 = space();
    			img = element("img");
    			add_location(h1, file$4, 6, 0, 166);
    			if (!src_url_equal(img.src, img_src_value = src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", alt);
    			add_location(img, file$4, 7, 0, 225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$name*/ 1) set_data_dev(t0, /*$name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const src = 'https://media.giphy.com/media/3ohhwzqvVKe4KHAXOE/giphy.gif';
    const alt = 'gooooold member';

    function instance$4($$self, $$props, $$invalidate) {
    	let $name;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, $$value => $$invalidate(0, $name = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ name, src, alt, $name });
    	return [$name];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Prestart.svelte generated by Svelte v3.44.1 */
    const file$3 = "src/Prestart.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let p3;
    	let t9;
    	let div0;
    	let ul;
    	let li0;
    	let t11;
    	let li1;
    	let t13;
    	let li2;
    	let t15;
    	let li3;
    	let t17;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Break The Story";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "You play as an aspiring football journalist aiming to make a name for yourself.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "You will be presented with stories from a whole range of people,\n    from online punters who've seen star players in motorway service stations to players\n    themselves. Just make sure you verify your sources...";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "Once you have a story, you can either try and sell it to a tabloid or broadsheet newspaper,\n    or break it yourself on social media. The more credible stories you break, the more likely\n    respectable publications are to buy your latest gossip. The more followers you gain on\n    social media, the more respect you'll gain for breaking news. But remember, the bigger you\n    are, the harder you fall, so make sure you're confident in your facts before publishing.";
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = "Before you start, some boring technical stuff:";
    			t9 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "You can't save your game - if you refresh your browser, you'll start a new game";
    			t11 = space();
    			li1 = element("li");
    			li1.textContent = "This site does not currently use cookies";
    			t13 = space();
    			li2 = element("li");
    			li2.textContent = "This site does not currently mine Dogecoin on your GPU";
    			t15 = space();
    			li3 = element("li");
    			li3.textContent = "If you're enjoying playing you can give me some money (link to follow)";
    			t17 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Let's get started";
    			add_location(h1, file$3, 6, 2, 102);
    			add_location(p0, file$3, 7, 2, 129);
    			add_location(p1, file$3, 8, 2, 218);
    			add_location(p2, file$3, 13, 2, 447);
    			add_location(p3, file$3, 20, 2, 930);
    			add_location(li0, file$3, 25, 6, 1015);
    			add_location(li1, file$3, 28, 6, 1126);
    			add_location(li2, file$3, 31, 6, 1198);
    			add_location(li3, file$3, 34, 6, 1284);
    			add_location(ul, file$3, 24, 4, 1004);
    			add_location(div0, file$3, 23, 2, 994);
    			add_location(div1, file$3, 5, 0, 94);
    			add_location(button, file$3, 42, 2, 1415);
    			add_location(div2, file$3, 41, 0, 1407);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, p1);
    			append_dev(div1, t5);
    			append_dev(div1, p2);
    			append_dev(div1, t7);
    			append_dev(div1, p3);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t11);
    			append_dev(ul, li1);
    			append_dev(ul, t13);
    			append_dev(ul, li2);
    			append_dev(ul, t15);
    			append_dev(ul, li3);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Prestart', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Prestart> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => gameState.update(g => constants.gameStates.setup);
    	$$self.$capture_state = () => ({ C: constants, gameState });
    	return [click_handler];
    }

    class Prestart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prestart",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Setup.svelte generated by Svelte v3.44.1 */
    const file$2 = "src/Setup.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let h2;
    	let t1;
    	let div0;
    	let p0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let p1;
    	let t6;
    	let input1;
    	let t7;
    	let button;
    	let t8;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Fill in your details:";
    			t1 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "What's your name?";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "What's your social handle?";
    			t6 = text("\n    @");
    			input1 = element("input");
    			t7 = space();
    			button = element("button");
    			t8 = text("Start");
    			add_location(h2, file$2, 10, 2, 136);
    			add_location(p0, file$2, 12, 4, 202);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 13, 4, 231);
    			attr_dev(div0, "class", "form-container");
    			add_location(div0, file$2, 11, 2, 169);
    			add_location(p1, file$2, 17, 4, 319);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 18, 5, 358);
    			attr_dev(div1, "class", "form-container");
    			add_location(div1, file$2, 16, 2, 286);
    			button.disabled = button_disabled_value = !/*$name*/ ctx[0] || !socialHandle;
    			attr_dev(button, "type", "submit");
    			add_location(button, file$2, 21, 2, 419);
    			add_location(div2, file$2, 9, 0, 128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h2);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*$name*/ ctx[0]);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*$socialHandle*/ ctx[1]);
    			append_dev(div2, t7);
    			append_dev(div2, button);
    			append_dev(button, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3]),
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$name*/ 1 && input0.value !== /*$name*/ ctx[0]) {
    				set_input_value(input0, /*$name*/ ctx[0]);
    			}

    			if (dirty & /*$socialHandle*/ 2 && input1.value !== /*$socialHandle*/ ctx[1]) {
    				set_input_value(input1, /*$socialHandle*/ ctx[1]);
    			}

    			if (dirty & /*$name*/ 1 && button_disabled_value !== (button_disabled_value = !/*$name*/ ctx[0] || !socialHandle)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $name;
    	let $socialHandle;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, $$value => $$invalidate(0, $name = $$value));
    	validate_store(socialHandle, 'socialHandle');
    	component_subscribe($$self, socialHandle, $$value => $$invalidate(1, $socialHandle = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Setup', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Setup> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$name = this.value;
    		name.set($name);
    	}

    	function input1_input_handler() {
    		$socialHandle = this.value;
    		socialHandle.set($socialHandle);
    	}

    	const click_handler = () => gameState.update(constants.gameStates.inGame);

    	$$self.$capture_state = () => ({
    		C: constants,
    		gameState,
    		name,
    		socialHandle,
    		$name,
    		$socialHandle
    	});

    	return [
    		$name,
    		$socialHandle,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler
    	];
    }

    class Setup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Setup",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Start.svelte generated by Svelte v3.44.1 */
    const file$1 = "src/Start.svelte";

    function create_fragment$1(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let input;
    	let t4;
    	let button;
    	let t5;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Ok, let's get this show on the road!";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Tell me your name. No jokes, I promise.";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button = element("button");
    			t5 = text("Submit");
    			add_location(h2, file$1, 8, 0, 110);
    			add_location(p, file$1, 9, 0, 156);
    			add_location(input, file$1, 11, 0, 204);
    			button.disabled = button_disabled_value = !/*$name*/ ctx[0];
    			attr_dev(button, "type", "submit");
    			add_location(button, file$1, 13, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$name*/ ctx[0]);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[1]),
    					listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$name*/ 1 && input.value !== /*$name*/ ctx[0]) {
    				set_input_value(input, /*$name*/ ctx[0]);
    			}

    			if (dirty & /*$name*/ 1 && button_disabled_value !== (button_disabled_value = !/*$name*/ ctx[0])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $name;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, $$value => $$invalidate(0, $name = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Start', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Start> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$name = this.value;
    		name.set($name);
    	}

    	const click_handler = () => gameState.update(g => constants.gameStates.main);
    	$$self.$capture_state = () => ({ C: constants, gameState, name, $name });
    	return [$name, input_input_handler, click_handler];
    }

    class Start extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Start",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */
    const file = "src/App.svelte";

    // (14:2) {#if $gameState === C.gameStates.prestart}
    function create_if_block_2(ctx) {
    	let prestart;
    	let current;
    	prestart = new Prestart({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(prestart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prestart, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prestart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prestart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prestart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(14:2) {#if $gameState === C.gameStates.prestart}",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if $gameState === C.gameStates.setup}
    function create_if_block_1(ctx) {
    	let setup;
    	let current;
    	setup = new Setup({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(setup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(setup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(18:2) {#if $gameState === C.gameStates.setup}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if $gameState === C.gameStates.main}
    function create_if_block(ctx) {
    	let main;
    	let current;
    	main = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(main.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(main, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(main, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:2) {#if $gameState === C.gameStates.main}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let t2;
    	let p;
    	let current;
    	let if_block0 = /*$gameState*/ ctx[1] === /*C*/ ctx[0].gameStates.prestart && create_if_block_2(ctx);
    	let if_block1 = /*$gameState*/ ctx[1] === /*C*/ ctx[0].gameStates.setup && create_if_block_1(ctx);
    	let if_block2 = /*$gameState*/ ctx[1] === /*C*/ ctx[0].gameStates.main && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			p = element("p");
    			p.textContent = "Break The Story by aNerdInTheHand © 2021.";
    			attr_dev(p, "class", "footer svelte-1g43i36");
    			add_location(p, file, 25, 1, 453);
    			attr_dev(main, "class", "svelte-1g43i36");
    			add_location(main, file, 12, 0, 249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t1);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t2);
    			append_dev(main, p);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$gameState*/ ctx[1] === /*C*/ ctx[0].gameStates.prestart) {
    				if (if_block0) {
    					if (dirty & /*$gameState, C*/ 3) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$gameState*/ ctx[1] === /*C*/ ctx[0].gameStates.setup) {
    				if (if_block1) {
    					if (dirty & /*$gameState, C*/ 3) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$gameState*/ ctx[1] === /*C*/ ctx[0].gameStates.main) {
    				if (if_block2) {
    					if (dirty & /*$gameState, C*/ 3) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $gameState;
    	validate_store(gameState, 'gameState');
    	component_subscribe($$self, gameState, $$value => $$invalidate(1, $gameState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { C } = $$props;
    	const writable_props = ['C'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('C' in $$props) $$invalidate(0, C = $$props.C);
    	};

    	$$self.$capture_state = () => ({
    		Main,
    		Prestart,
    		Setup,
    		Start,
    		C,
    		chance,
    		gameState,
    		$gameState
    	});

    	$$self.$inject_state = $$props => {
    		if ('C' in $$props) $$invalidate(0, C = $$props.C);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [C, $gameState];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { C: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*C*/ ctx[0] === undefined && !('C' in props)) {
    			console.warn("<App> was created without expected prop 'C'");
    		}
    	}

    	get C() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set C(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		C: constants
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
