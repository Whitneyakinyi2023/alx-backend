#!/usr/bin/env python3
"""Simple implementation ofpagination fiction"""


def index_range(page: int, page_size: int) -> tuple:
    """
    Returns a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for those
    particular pagination parameters.

    Args:
    - page: Current page number (1-indexed).
    - page_size: Number of items per page.

    Returns:
    - A tuple containing the start and end index for the pagination range.
    """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return (start_index, end_index)
