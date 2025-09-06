type Props = {
  className?: string
  size?: number
}

export default function IconKettle({ className = '', size = 24 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Simple clay kettle / teapot silhouette */}
      <path d="M8.5 8.5c0-1.933 2.239-3.5 5-3.5 2.761 0 5 1.567 5 3.5v.25c1.062.115 1.954.61 2.5 1.375.61.867.69 1.967.44 2.944-.25.977-.84 1.831-1.64 2.43-.72.54-1.62.835-2.55 1.001a7.5 7.5 0 0 1-14.1 0c-.93-.166-1.83-.461-2.55-1C-.35 14.5-.94 13.645-.19 11.07c.75-2.575 2.78-2.32 4.69-2.32H5c.37-.23.8-.42 1.28-.57.75-.23 1.61-.36 2.22-.36zm5-1.5c-2.209 0-4 .895-4 2s1.791 2 4 2 4-.895 4-2-1.791-2-4-2zM7 17.5a5 5 0 0 0 10 0H7z" />
    </svg>
  )
}
