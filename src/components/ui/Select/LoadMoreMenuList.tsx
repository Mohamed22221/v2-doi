import { components, GroupBase, MenuListProps } from "react-select";
import Button from "../Button";

function LoadMoreMenuList<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(props: MenuListProps<Option, IsMulti, Group>) {
  const { children, selectProps } = props as typeof props & {
    selectProps: {
      hasMore?: boolean;
      isLoadingMore?: boolean;
      onLoadMore?: () => void;
      loadMoreLabel?: string;
    };
  };

  const hasMore = !!selectProps.hasMore;
  const isLoadingMore = selectProps.isLoadingMore;
  const onLoadMore = selectProps.onLoadMore;
  const label = selectProps.loadMoreLabel ?? "Load more";

  return (
    <components.MenuList {...props}>
      {children}

      {hasMore && (
        <div style={{ padding: 8 }}>
          <Button
            type="button"
            size="xs"
            onClick={onLoadMore}
            disabled={!onLoadMore || isLoadingMore}
            style={{
              width: "100%",
              cursor: isLoadingMore ? "not-allowed" : "pointer",
            }}
            loading={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : label}
          </Button>
        </div>
      )}
    </components.MenuList>
  );
}

export default LoadMoreMenuList