<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <defs>
      <mask id="ixpansion">
        <g fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">
          <path d="M8 42h32a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v32a2 2 0 0 0 2 2" />
          <path fill="rgba(85,85,85,0.428)" fillRule="evenodd" d="M42 8a2 2 0 0 0-2-2H28v14h14z" clipRule="evenodd" />
          <g d="m13 35l10-10m0 0v7m0-7h-7" fill="red" />
        </g>
      </mask>
    </defs>
    <path fill="red" d="M0 0h48v48H0z" mask="url(#ixpansion)" />
  </svg>
</template>
