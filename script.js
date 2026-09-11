const menuLinks = document.querySelectorAll('.menu-list a, .mobile-menu-overlay a');
const sections = document.querySelectorAll('.page-section');


/* ---------- Sidebar Navigation ---------- */

menuLinks.forEach(function (link) {

  link.addEventListener('click', function (e) {

    e.preventDefault();

    if (link.closest('.mobile-menu-overlay')) {
      closeMobileMenu();
    }

    if (link.dataset.section === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      return;
    }

    const targetId = link.dataset.section;
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  });

});


/* ---------- Active Sidebar Item ---------- */

const observer = new IntersectionObserver(
  function (entries) {

    const visibleSections = [...entries]
      .filter(function (entry) {
        return entry.isIntersecting;
      })
      .sort(function (a, b) {
        return b.intersectionRatio - a.intersectionRatio;
      });

    if (visibleSections.length === 0) {
      return;
    }

    const activeSection = visibleSections[0].target.id;

    menuLinks.forEach(function (link) {

      link.classList.toggle(
        'active',
        link.dataset.section === activeSection
      );

    });

  },
  {
    threshold: [0.25, 0.5, 0.75],
    rootMargin: '-10% 0px -10% 0px'
  }
);


sections.forEach(function (section) {
  observer.observe(section);
});

// ============================================================
// MOBILE MENU
// ============================================================

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');


function openMobileMenu() {

  mobileMenuOverlay.classList.add('open');

  mobileMenuToggle.setAttribute(
    'aria-expanded',
    'true'
  );

  document.documentElement.classList.add('no-scroll');
}


function closeMobileMenu() {

  mobileMenuOverlay.classList.remove('open');

  mobileMenuToggle.setAttribute(
    'aria-expanded',
    'false'
  );

  document.documentElement.classList.remove('no-scroll');
}


if (mobileMenuToggle && mobileMenuOverlay) {

  mobileMenuToggle.addEventListener('click', function () {

    const isOpen =
      mobileMenuOverlay.classList.contains('open');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }

  });

}

// ============================================================
// GITHUB PROJECTS
// ============================================================

const projectsGrid = document.getElementById('projects-grid');

const GITHUB_USERNAME = 'bnjjo';

async function loadProjects() {

  if (!projectsGrid) {
    return;
  }

  try {

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API returned ${response.status}`
      );
    }

    const repos = (await response.json())
      .filter(function (repo) {
        return !repo.fork;
      })
      .sort(function (a, b) {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

    projectsGrid.innerHTML = '';

    repos.forEach(function (repo) {

      const project = document.createElement('a');

      project.className = 'project';
      project.href = repo.html_url;
      project.target = '_blank';
      project.rel = 'noopener noreferrer';

      const title = document.createElement('h3');

      title.textContent = repo.name;

      const description = document.createElement('p');

      description.textContent =
        repo.description || 'No description provided.';

      project.appendChild(title);
      project.appendChild(description);

      projectsGrid.appendChild(project);
    });

  } catch (error) {

    console.error(
      'Failed to load GitHub repositories:',
      error
    );

    projectsGrid.innerHTML = `
      <p class="projects-error">
        couldn't load projects.
      </p>
    `;
  }
}

loadProjects();


// ============================================================
// CONTACT FORM
// ============================================================

const CONTACT_EMAIL = 'hi@bnjjo.dev';

const contactForm = document.getElementById('contact-form');

if (contactForm) {

  contactForm.addEventListener('submit', function (e) {

    e.preventDefault();

    const emailField =
      document.getElementById('contact-email');

    const messageField =
      document.getElementById('contact-message');

    const senderEmail =
      emailField.value.trim();

    const message =
      messageField.value.trim();

    const subject =
      `Message from ${senderEmail}`;

    const mailtoUrl =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoUrl;

  });

}


// ============================================================
// HERO TYPEWRITER
// ============================================================

const hero = document.querySelector('.hero');

if (hero) {

  const heroTexts = [
    'bnjjo.dev',
    'impl fmt::Display for Site {',
    'package dev.bnjjo;',
    'bnjjo :: [Idea] -> Software',
    ':wqa',
  ];

  const typingSpeed = 110;
  const deletingSpeed = 65;

  const pauseAfterTyping = 1800;
  const pauseBeforeTyping = 500;

  let textIndex = 0;

  hero.innerHTML = '';

  const textContainer =
    document.createElement('span');

  const cursor =
    document.createElement('span');

  textContainer.className = 'hero-text';
  cursor.className = 'hero-cursor';

  hero.appendChild(textContainer);
  hero.appendChild(cursor);


  // ----------------------------------------------------------
  // TYPE
  // ----------------------------------------------------------

  function typeText(text, done) {

    let index = 0;

    function typeNext() {

      if (index >= text.length) {
        setTimeout(done, pauseAfterTyping);
        return;
      }

      textContainer.textContent =
        text.slice(0, index + 1);

      index++;

      setTimeout(
        typeNext,
        typingSpeed
      );
    }

    typeNext();
  }


  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  function deleteText(done) {

    let text =
      textContainer.textContent;

    function deleteNext() {

      if (text.length === 0) {
        textContainer.textContent = '';
        setTimeout(done, pauseBeforeTyping);
        return;
      }

      text =
        text.slice(0, -1);

      textContainer.textContent =
        text;

      setTimeout(
        deleteNext,
        deletingSpeed
      );
    }

    deleteNext();
  }


  // ----------------------------------------------------------
  // NEXT TEXT
  // ----------------------------------------------------------

  function nextText() {

    textIndex =
      (textIndex + 1) %
      heroTexts.length;

    typeText(
      heroTexts[textIndex],
      function () {
        deleteText(nextText);
      }
    );
  }


  // ----------------------------------------------------------
  // START
  // ----------------------------------------------------------

  setTimeout(function () {

    typeText(
      heroTexts[textIndex],
      function () {
        deleteText(nextText);
      }
    );

  }, pauseBeforeTyping);
}


// ============================================================
// WEBGL BACKGROUND
// ============================================================

const canvas =
  document.getElementById('bg-canvas');

const gl =
  canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power'
  });

if (!gl) {

  console.warn(
    'WebGL2 unavailable - background animation disabled.'
  );

} else {

  // ----------------------------------------------------------
  // VERTEX SHADER
  // ----------------------------------------------------------

  const VERTEX_SRC = `#version 300 es

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;


  // ----------------------------------------------------------
  // FRAGMENT SHADER
  // ----------------------------------------------------------

  const FRAGMENT_SRC = `#version 300 es

precision highp float;
precision highp int;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_step;
uniform float u_patternCosMod;
uniform float u_patternSinMod;

uniform sampler2D u_sinCosLUT;

out vec4 outColor;

const float TWO_PI = 6.283185307179586;

const int LUT_SIZE = 2048;


vec2 sinCosLookup(float angle) {

  float normalized =
    fract(angle / TWO_PI);

  int index =
    int(
      floor(
        normalized *
        float(LUT_SIZE)
      )
    );

  index =
    clamp(
      index,
      0,
      LUT_SIZE - 1
    );

  return texelFetch(
    u_sinCosLUT,
    ivec2(index, 0),
    0
  ).rg;
}


vec3 paletteColor(int idx) {

  if (idx == 0)  return vec3(0.0);
  if (idx == 1)  return vec3(5.0);
  if (idx == 2)  return vec3(10.0);
  if (idx == 3)  return vec3(15.0);
  if (idx == 4)  return vec3(20.0);
  if (idx == 5)  return vec3(26.0);
  if (idx == 6)  return vec3(31.0);
  if (idx == 7)  return vec3(36.0);
  if (idx == 8)  return vec3(42.0);
  if (idx == 9)  return vec3(47.0);
  if (idx == 10) return vec3(51.0);

  return vec3(56.0);
}


void main() {

  float bx =
    floor(
      gl_FragCoord.x /
      u_step
    ) * u_step;

  float by =
    floor(
      (u_resolution.y -
      gl_FragCoord.y) /
      u_step
    ) * u_step;


  float uvx =
    (bx * 2.0 -
    u_resolution.x) /
    (u_resolution.y * 2.0);

  float uvy =
    (by * 2.0 -
    u_resolution.y) /
    u_resolution.y;


  float uv2x =
    uvx + uvy;

  float uv2y =
    uvx + uvy;


  for (int i = 0; i < 2; i++) {

    float len =
      length(
        vec2(uvx, uvy)
      );

    uv2x +=
      uvx + len;

    uv2y +=
      uvy + len;


    float angleA =
      u_patternCosMod +
      uv2y * 0.2 +
      u_time * 0.32;

    float angleB =
      u_patternSinMod +
      uv2x -
      u_time * 0.32;


    vec2 scA =
      sinCosLookup(angleA);

    vec2 scB =
      sinCosLookup(angleB);


    uvx +=
      0.5 * scA.y;

    uvy +=
      0.5 * scB.x;


    float angleC =
      uvx + uvy;

    float angleD =
      uvx * 0.7 - uvy;


    vec2 scC =
      sinCosLookup(angleC);

    vec2 scD =
      sinCosLookup(angleD);


    float cosTerm =
      scC.y;

    float sinTerm =
      scD.x;


    uvx -=
      cosTerm - sinTerm;

    uvy -=
      cosTerm - sinTerm;
  }


  int idx =
    int(
      mod(
        floor(
          length(
            vec2(uvx, uvy)
          ) * 5.0
        ),
        12.0
      )
    );


  outColor =
    vec4(
      paletteColor(idx) / 255.0,
      1.0
    );
}`;


  // ----------------------------------------------------------
  // SHADER COMPILATION
  // ----------------------------------------------------------

  function compileShader(type, source) {

    const shader =
      gl.createShader(type);

    if (!shader) {
      console.error(
        'Failed to create WebGL shader.'
      );

      return null;
    }

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(shader);

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {

      console.error(
        'WebGL shader error:',
        gl.getShaderInfoLog(shader)
      );

      gl.deleteShader(shader);

      return null;
    }

    return shader;
  }


  const vertexShader =
    compileShader(
      gl.VERTEX_SHADER,
      VERTEX_SRC
    );

  const fragmentShader =
    compileShader(
      gl.FRAGMENT_SHADER,
      FRAGMENT_SRC
    );


  if (
    !vertexShader ||
    !fragmentShader
  ) {

    console.error(
      'WebGL background disabled because shader compilation failed.'
    );

  } else {

    // --------------------------------------------------------
    // PROGRAM
    // --------------------------------------------------------

    const program =
      gl.createProgram();

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.bindAttribLocation(
      program,
      0,
      'a_position'
    );

    gl.linkProgram(
      program
    );


    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {

      console.error(
        'WebGL program link error:',
        gl.getProgramInfoLog(program)
      );

    } else {

      gl.useProgram(
        program
      );


      // ------------------------------------------------------
      // FULLSCREEN TRIANGLE
      // ------------------------------------------------------

      const vao =
        gl.createVertexArray();

      gl.bindVertexArray(
        vao
      );


      const positionBuffer =
        gl.createBuffer();

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        positionBuffer
      );


      const positions =
        new Float32Array([
          -1.0, -1.0,
           3.0, -1.0,
          -1.0,  3.0
        ]);


      gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
      );


      gl.enableVertexAttribArray(
        0
      );


      gl.vertexAttribPointer(
        0,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );


      // ------------------------------------------------------
      // SIN/COS GPU LUT
      // ------------------------------------------------------

      const LUT_SIZE = 2048;

      const lutData =
        new Float32Array(
          LUT_SIZE * 2
        );


      for (
        let i = 0;
        i < LUT_SIZE;
        i++
      ) {

        const angle =
          (i / LUT_SIZE) *
          Math.PI *
          2.0;


        lutData[i * 2] =
          Math.sin(angle);

        lutData[i * 2 + 1] =
          Math.cos(angle);
      }


      const sinCosTexture =
        gl.createTexture();


      gl.activeTexture(
        gl.TEXTURE0
      );


      gl.bindTexture(
        gl.TEXTURE_2D,
        sinCosTexture
      );


      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RG32F,
        LUT_SIZE,
        1,
        0,
        gl.RG,
        gl.FLOAT,
        lutData
      );


      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.NEAREST
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        gl.NEAREST
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
      );


      // ------------------------------------------------------
      // UNIFORMS
      // ------------------------------------------------------

      const u_resolution =
        gl.getUniformLocation(
          program,
          'u_resolution'
        );

      const u_time =
        gl.getUniformLocation(
          program,
          'u_time'
        );

      const u_step =
        gl.getUniformLocation(
          program,
          'u_step'
        );

      const u_patternCosMod =
        gl.getUniformLocation(
          program,
          'u_patternCosMod'
        );

      const u_patternSinMod =
        gl.getUniformLocation(
          program,
          'u_patternSinMod'
        );

      const u_sinCosLUT =
        gl.getUniformLocation(
          program,
          'u_sinCosLUT'
        );


      // ------------------------------------------------------
      // STATIC VALUES
      // ------------------------------------------------------

      const patternCosMod =
        Math.random() *
        Math.PI *
        2;

      const patternSinMod =
        Math.random() *
        Math.PI *
        2;


      const step = 3;

      const timeScale = 1.0;


      gl.uniform1i(
        u_sinCosLUT,
        0
      );


      gl.uniform1f(
        u_step,
        step
      );


      gl.uniform1f(
        u_patternCosMod,
        patternCosMod
      );


      gl.uniform1f(
        u_patternSinMod,
        patternSinMod
      );


      gl.disable(
        gl.DEPTH_TEST
      );

      gl.disable(
        gl.BLEND
      );

      gl.disable(
        gl.CULL_FACE
      );


      // ------------------------------------------------------
      // PERFORMANCE
      // ------------------------------------------------------

      const targetFPS = 60;

      const frameInterval =
        1000 / targetFPS;

      const renderScale = 0.38;


      // ------------------------------------------------------
      // STATE
      // ------------------------------------------------------

      let width = 0;
      let height = 0;

      let animationFrame = null;

      let lastFrameTime = 0;

      let running = true;

      const startTime =
        performance.now();


      // ------------------------------------------------------
      // RESIZE
      // ------------------------------------------------------

      function resize() {

        const newWidth =
          Math.max(
            1,
            Math.floor(
              window.innerWidth *
              renderScale
            )
          );


        const newHeight =
          Math.max(
            1,
            Math.floor(
              window.innerHeight *
              renderScale
            )
          );


        if (
          newWidth === width &&
          newHeight === height
        ) {
          return;
        }


        width =
          newWidth;

        height =
          newHeight;


        canvas.width =
          width;

        canvas.height =
          height;


        gl.viewport(
          0,
          0,
          width,
          height
        );


        gl.uniform2f(
          u_resolution,
          width,
          height
        );
      }


      // ------------------------------------------------------
      // DRAW
      // ------------------------------------------------------

      function draw(now) {

        if (!running) {

          animationFrame =
            null;

          return;
        }


        if (
          now - lastFrameTime <
          frameInterval
        ) {

          animationFrame =
            requestAnimationFrame(
              draw
            );

          return;
        }


        lastFrameTime =
          now;


        const time =
          (now - startTime) *
          0.001 *
          timeScale;


        gl.uniform1f(
          u_time,
          time
        );


        gl.drawArrays(
          gl.TRIANGLES,
          0,
          3
        );


        animationFrame =
          requestAnimationFrame(
            draw
          );
      }


      // ------------------------------------------------------
      // START / STOP
      // ------------------------------------------------------

      function startAnimation() {

        if (
          running &&
          animationFrame !== null
        ) {
          return;
        }


        running = true;

        lastFrameTime =
          performance.now();


        animationFrame =
          requestAnimationFrame(
            draw
          );
      }


      function stopAnimation() {

        running = false;


        if (
          animationFrame !== null
        ) {

          cancelAnimationFrame(
            animationFrame
          );

          animationFrame =
            null;
        }
      }


      // ------------------------------------------------------
      // TAB VISIBILITY
      // ------------------------------------------------------

      document.addEventListener(
        'visibilitychange',
        function () {

          if (document.hidden) {

            stopAnimation();

          } else {

            startAnimation();

          }
        }
      );


      // ------------------------------------------------------
      // RESIZE
      // ------------------------------------------------------

      window.addEventListener(
        'resize',
        resize,
        {
          passive: true
        }
      );


      // ------------------------------------------------------
      // START
      // ------------------------------------------------------

      resize();

      animationFrame =
        requestAnimationFrame(
          draw
        );
    }
  }
}
