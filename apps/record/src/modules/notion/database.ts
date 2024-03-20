/* ================================================================================

	database-update-send-email.

  Glitch example: https://glitch.com/edit/#!/notion-database-email-update
  Find the official Notion API client @ https://github.com/makenotion/notion-sdk-js/

================================================================================ */

import { Client } from '@notionhq/client';
import { PropertyItemObjectResponse } from '@/interface/api-endpoints';
// // https://www.notion.so/8a22f98244704ac083b22b03598a882f?v=b03a9074c36442a780b6c212fb14c1d7
// // https://cheddar-lemongrass-c87.notion.site/8a22f98244704ac083b22b03598a882f?v=b03a9074c36442a780b6c212fb14c1d7&pvs=4
// https://www.notion.so/8a22f98244704ac083b22b03598a882f?v=b03a9074c36442a780b6c212fb14c1d7&pvs=4
const notion = new Client({
  auth: 'secret_nq1HTnlq0qGre2wAocQDGQuHhBDIF1M22JSSRchIZYw',
});
const databaseId = '8a22f98244704ac083b22b03598a882f';

/**
 * Local map to store task pageId to its last status.
 * { [pageId: string]: string }
 */
const taskPageIdToStatusMap: any = {};

/**
 * Initialize local data store.
 * Then poll for changes every 5 seconds (5000 milliseconds).
 */

export const initDatabase = async () => {
  // setInitialTaskPageIdToStatusMap().then(() => {
  //   // setInterval(findAndSendEmailsForUpdatedTasks, 5000);
  //   findAndSendEmailsForUpdatedTasks();
  // });

  return await setInitialTaskPageIdToStatusMap()
};

/**
 * Get and set the initial data store with tasks currently in the database.
 */
async function setInitialTaskPageIdToStatusMap() {
  const currentTasks = await getTasksFromNotionDatabase();

  return currentTasks
}


/**
 * Gets tasks from the database.
 */
async function getTasksFromNotionDatabase(): Promise<
  Array<{ pageId: string; status: string; title: string }>
> {
  const pages = [];
  let cursor = undefined;

  const shouldContinue = true;
  while (shouldContinue) {
    const { results, next_cursor } = await notion.databases.query({
      database_id: databaseId ?? '',
      start_cursor: cursor,
    });
    pages.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }

  const tasks = [];
  for (const page of pages) {
    const pageId = page.id;
    // @ts-ignore
    const introducePropertyId = page.properties['introduce'].id;
    const introducePropertyItem = await getPropertyValue({
      pageId,
      propertyId: introducePropertyId,
    });
    const introduce = getStatusPropertyValue(introducePropertyItem);

    // @ts-ignore
    const statusPropertyId = page.properties['Status'].id;
    const statusPropertyItem = await getPropertyValue({
      pageId,
      propertyId: statusPropertyId,
    });

    const status = getStatusPropertyValue(statusPropertyItem);
    // @ts-ignore
    const titlePropertyId = page.properties['Name'].id;
    const titlePropertyItems = await getPropertyValue({
      pageId,
      propertyId: titlePropertyId,
    });
    const title = getTitlePropertyValue(titlePropertyItems);

    tasks.push({ pageId, status, title, introduce });
  }

  return tasks;
}

/**
 * Extract status as string from property value
 */
function getStatusPropertyValue(
  property: PropertyItemObjectResponse | Array<PropertyItemObjectResponse>
): string {
  if (Array.isArray(property)) {
    return parseProperType(property[0]);
  } else {
    return parseProperType(property);
  }
}

function parseProperType(property: PropertyItemObjectResponse) {
  if (!property) {
    return '';
  }

  if (property.type === 'rich_text') {
    return property['rich_text'].plain_text ?? '';
  }

  if (property.type === 'status') {
    return property['status']?.name ?? '';
  }

  return `No ${property.type}!`;
}

/**
 * Extract title as string from property value
 */
function getTitlePropertyValue(
  property: PropertyItemObjectResponse | Array<PropertyItemObjectResponse>
): string {
  if (Array.isArray(property)) {
    if (property[0]?.type === 'title') {
      return property[0].title.plain_text;
    } else {
      return 'No Title';
    }
  } else {
    if (property.type === 'title') {
      return property.title.plain_text;
    } else {
      return 'No Title';
    }
  }
}

/**
 * If property is paginated, returns an array of property items.
 *
 * Otherwise, it will return a single property item.
 */
async function getPropertyValue({
  pageId,
  propertyId,
}: {
  pageId: string;
  propertyId: string;
}): Promise<PropertyItemObjectResponse | Array<PropertyItemObjectResponse>> {
  let propertyItem = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propertyId,
  });
  if (propertyItem.object === 'property_item') {
    return propertyItem;
  }

  // Property is paginated.
  let nextCursor = propertyItem.next_cursor;
  const results = propertyItem.results;

  while (nextCursor !== null) {
    propertyItem = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
      start_cursor: nextCursor,
    });

    if (propertyItem.object === 'list') {
      nextCursor = propertyItem.next_cursor;
      results.push(...propertyItem.results);
    } else {
      nextCursor = null;
    }
  }

  return results;
}
